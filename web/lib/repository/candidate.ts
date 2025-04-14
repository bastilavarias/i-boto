import { httpClient, toQueryResponse, toQueryString } from '@/lib/http-client'

interface GetCandidatesRepositoryParams {
    page: number
    perPage: number
    withVotes?: number
    sortBy?: string
}
export const getCandidatesRepository = async (
    params: GetCandidatesRepositoryParams
) => {
    try {
        const response = await httpClient.get(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            `/api/candidate?${toQueryString(params)}`
        )
        return toQueryResponse.success(response, 'Candidate list fetched.')
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        return toQueryResponse.error(error?.message)
    }
}
