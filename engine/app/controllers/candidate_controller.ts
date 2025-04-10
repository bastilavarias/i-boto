import type { HttpContext } from '@adonisjs/core/http'

import Candidate from '#models/candidate'
import SignatureService from '#services/signature_service'
import env from '#start/env'

export default class CandidateController {
  constructor(private signatureService: SignatureService) {}

  public async index({ request }: HttpContext) {
    const {
      withVotes,
      sortBy,
      page = 1,
      perPage = 5,
    } = request.only(['withVotes', 'sortBy', 'page', 'perPage'])
    const candidatesQuery = Candidate.query()
    if (withVotes) {
      candidatesQuery
        .withCount('voteTallies')
        .preload('voteTallies')
        .orderBy('voteTallies_count', sortBy)
    }
    const candidates = await candidatesQuery.paginate(page, perPage)
    if (!withVotes) {
      return candidates
    }
    const filteredCandidates = candidates.all().map((candidate) => {
      const filteredVotes = candidate.voteTallies.filter((vote) => {
        return this.signatureService.verifyLocalSignature(
          env.get('VOTE_TALLY_SIGNATURE_DATA'),
          vote.signature
        )
      })
      const serialized = candidate.serialize()
      delete serialized.voteTallies
      const voteSum = filteredVotes.reduce((sum, vote) => sum + vote.vote, 0)

      return {
        ...serialized,
        votes: voteSum,
      }
    })

    if (sortBy === 'asc') {
      filteredCandidates.sort((a, b) => a.votes - b.votes)
    } else if (sortBy === 'desc') {
      filteredCandidates.sort((a, b) => b.votes - a.votes)
    }

    return {
      meta: candidates.getMeta(),
      data: filteredCandidates,
    }
  }
}
