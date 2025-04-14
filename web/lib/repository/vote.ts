import { httpClient, toQueryResponse } from '@/lib/http-client'
import { exportPubKeyBase64, signData } from '@/lib/crypto/signature'

export const createVoteRepository = async (codes: string[]) => {
    try {
        const signatureData = { candidates: codes }
        const signature = await signData(signatureData)
        const pubKey = await exportPubKeyBase64()
        if (signature && pubKey) {
            const response = await httpClient.post(`/api/vote`, {
                vote: signatureData,
                sig: signature,
                pubKey,
            })
            return toQueryResponse.success(
                response,
                'Vote successfully submitted!'
            )
        }

        return toQueryResponse.error('Invalid signature!')
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        return toQueryResponse.error(error?.message)
    }
}

export const getTotalVoteCountRepository = async () => {
    try {
        const response = await httpClient.get(`/api/vote/total`)
        return toQueryResponse.success(
            response,
            'Total vote count successfully got. submitted!'
        )
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        return toQueryResponse.error(error?.message)
    }
}
