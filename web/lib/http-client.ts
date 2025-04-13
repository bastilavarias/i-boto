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

export class HttpClient {
    private baseUrl: string

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || process.env.API_BASE_URL || ''

        if (!this.baseUrl) {
            console.warn('No base URL provided. Using relative paths')
        }
    }

    private async request<TResponse = unknown, TBody = unknown>(
        method: HttpMethod,
        endpoint: string,
        options: RequestOptions<TBody> = {}
    ): Promise<TResponse> {
        // Build URL with query params
        const url = new URL(endpoint, this.baseUrl)

        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.append(key, value)
            })
        }

        // Prepare headers
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...options.headers,
        })

        // Prepare config
        const config: RequestInit = {
            method,
            headers,
        }

        // Add body if present
        if (options.body) {
            config.body = JSON.stringify(options.body)
        }

        try {
            const response = await fetch(url.toString(), config)

            if (!response.ok) {
                let errorMessage = `HTTP error ${response.status}`
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch {
                    // Ignore JSON parse errors for error response
                }
                throw new HttpError(response.status, errorMessage)
            }

            // Handle empty response
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

    public async get<TResponse = unknown>(
        endpoint: string,
        options?: Omit<RequestOptions, 'body'>
    ): Promise<TResponse> {
        return this.request<TResponse>('GET', endpoint, options)
    }

    public async post<TResponse = unknown, TBody = unknown>(
        endpoint: string,
        body: TBody,
        options?: RequestOptions<TBody>
    ): Promise<TResponse> {
        return this.request<TResponse, TBody>('POST', endpoint, {
            ...options,
            body,
        })
    }

    public async put<TResponse = unknown, TBody = unknown>(
        endpoint: string,
        body: TBody,
        options?: RequestOptions<TBody>
    ): Promise<TResponse> {
        return this.request<TResponse, TBody>('PUT', endpoint, {
            ...options,
            body,
        })
    }

    public async patch<TResponse = unknown, TBody = unknown>(
        endpoint: string,
        body: TBody,
        options?: RequestOptions<TBody>
    ): Promise<TResponse> {
        return this.request<TResponse, TBody>('PATCH', endpoint, {
            ...options,
            body,
        })
    }

    public async delete<TResponse = unknown>(
        endpoint: string,
        options?: Omit<RequestOptions, 'body'>
    ): Promise<TResponse> {
        return this.request<TResponse>('DELETE', endpoint, options)
    }
}

// Default instance with environment variable
export const http = new HttpClient()
