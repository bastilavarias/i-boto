type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions<TBody = unknown> {
    body?: TBody
    headers?: Record<string, string>
    params?: Record<string, string>
}

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
        this.name = 'HttpError'
    }
}

const baseUrl = process.env.NEXT_PUBLIC_API_KEY || 'http://localhost:3333'

if (!baseUrl) {
    console.warn('No base URL provided. Using relative paths')
}

async function request<TResponse = unknown, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions<TBody> = {}
): Promise<TResponse> {
    const url = new URL(endpoint, baseUrl)

    if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
        })
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        ...options.headers,
    })

    const config: RequestInit = {
        method,
        headers,
        credentials: 'include',
    }

    if (options.body) {
        config.body = JSON.stringify(options.body)
    }

    try {
        const response = await fetch(url.toString(), {
            ...config,
        })

        if (!response.ok) {
            let errorMessage = `HTTP error ${response.status}`
            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
            } catch {
                // ignore
            }
            throw new HttpError(response.status, errorMessage)
        }

        if (response.status === 204) {
            return undefined as unknown as TResponse
        }

        return response.json() as Promise<TResponse>
    } catch (error) {
        if (error instanceof HttpError) {
            throw error
        }
        throw new Error(`Network error: ${(error as Error).message}`)
    }
}

export const httpClient = {
    get<TResponse = never>(
        endpoint: string,
        options?: Omit<RequestOptions, 'body'>
    ): Promise<TResponse> {
        return request<TResponse>('GET', endpoint, options)
    },

    post<TResponse = unknown, TBody = unknown>(
        endpoint: string,
        body: TBody,
        options?: RequestOptions<TBody>
    ): Promise<TResponse> {
        return request<TResponse, TBody>('POST', endpoint, {
            ...options,
            body,

            headers: { 'Content-Type': 'application/json' },
        })
    },

    put<TResponse = unknown, TBody = unknown>(
        endpoint: string,
        body: TBody,
        options?: RequestOptions<TBody>
    ): Promise<TResponse> {
        return request<TResponse, TBody>('PUT', endpoint, { ...options, body })
    },

    patch<TResponse = unknown, TBody = unknown>(
        endpoint: string,
        body: TBody,
        options?: RequestOptions<TBody>
    ): Promise<TResponse> {
        return request<TResponse, TBody>('PATCH', endpoint, {
            ...options,
            body,
        })
    },

    delete<TResponse = unknown>(
        endpoint: string,
        options?: Omit<RequestOptions, 'body'>
    ): Promise<TResponse> {
        return request<TResponse>('DELETE', endpoint, options)
    },
}

export const toQueryString = (obj: Record<string, unknown>) => {
    return new URLSearchParams(
        Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)]))
    ).toString()
}

type QueryResponse<T = unknown> = {
    success: boolean
    data: T | null
    message: string | null
}

type ToQueryResponseFn = {
    <T = unknown>(
        success: boolean,
        data: T | null,
        message: string | null
    ): QueryResponse<T>

    success: <T = unknown>(data: T, message?: string | null) => QueryResponse<T>
    error: (message: string) => QueryResponse<null>
}

export const toQueryResponse: ToQueryResponseFn = <T = unknown>(
    success: boolean,
    data: T | null,
    message: string | null
) => ({ success, data, message })

toQueryResponse.success = <T = unknown>(
    data: T,
    message: string | null = null
) => toQueryResponse(true, data, message)

toQueryResponse.error = (message: string) =>
    toQueryResponse(false, null, message)
