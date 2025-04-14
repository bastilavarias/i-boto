import { httpClient, toQueryResponse } from '@/lib/http-client'

export const generateReceiptRepository = async (codes: string[]) => {
    try {
        const response = await httpClient.post(`/api/receipt`, {
            codes,
        })
        return toQueryResponse.success(
            response,
            'Receipt successfully generated!'
        )
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        return toQueryResponse.error(error?.message)
    }
}
