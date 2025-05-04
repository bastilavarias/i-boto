import type { HttpContext } from '@adonisjs/core/http'
import RawVote from '#models/raw_vote'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import web3StorageClient from '#start/web3_storage'
import UserHistory from '#models/user_history'
import VoteRecord from '#models/vote_record'
import VoteTally from '#models/vote_tally'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import CryptographyService from '#services/cryptography_service'

@inject()
export default class VoteController {
  constructor(private cryptographyService: CryptographyService) {}

  public async create({ request, response }: HttpContext) {
    try {
      let { vote, sig, pubKey } = request.only(['vote', 'sig', 'pubKey', 'user'])
      //@ts-ignore
      const user = request.user
      if (!user) {
        throw new Error('Impostor.SUS.')
      }
      const isValidSignature = this.cryptographyService.verifyClientSignature(
        JSON.stringify(vote),
        sig,
        pubKey
      )
      if (!isValidSignature) {
        throw new Error('Invalid vote signature.')
      }
      const encryptedVote = {
        ...vote,
        candidates: vote.candidates.map((candidate: string) =>
          this.cryptographyService.encrypt(candidate)
        ),
      }
      const rawVote = await RawVote.create({
        vote: JSON.stringify(encryptedVote),
        signature: sig,
        publicKey: pubKey,
      })
      if (!rawVote) {
        throw new Error('Invalid vote process.')
      }
      await UserHistory.create({
        user: this.cryptographyService.makeHash(user),
      })

      return response.status(200).json({
        message: 'Voted successfully!',
      })
    } catch (error) {
      console.error(error.message)
      return response.unauthorized({
        message: error.message,
      })
    }
  }

  public async process() {
    try {
      const rawVotes = await RawVote.all()
      if (rawVotes.length === 0) {
        return
      }
      let validRawVotes: RawVote[] = []
      let idsToDelete: number[] = []
      rawVotes.forEach((rawVote) => {
        const { vote, signature, publicKey } = rawVote
        const parsedVote = JSON.parse(vote)
        const decryptedVoteData = {
          ...parsedVote,
          candidates: parsedVote.candidates.map((candidate: string) => {
            return this.cryptographyService.decrypt(candidate)
          }),
        }
        const isValidSignature = this.cryptographyService.verifyClientSignature(
          JSON.stringify(decryptedVoteData),
          signature,
          publicKey
        )
        if (isValidSignature) {
          parsedVote.vote = {
            ...decryptedVoteData,
          }
          validRawVotes.push(parsedVote)
          idsToDelete.push(rawVote.id)
        }
      })
      if (validRawVotes.length === 0) {
        throw new Error('No valid votes.')
      }
      // @ts-ignore
      const votes = validRawVotes.map(({ vote }) => vote.candidates).flat()
      const leaves = votes.map((vote) => keccak256(Buffer.from(vote)))
      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
      const root = tree.getRoot().toString('hex')
      const signature = this.cryptographyService.sign(root)
      const voteTree = {
        root,
        leaves: leaves.map((leaf) => leaf.toString('hex')),
        votes: votes.map((vote) => this.cryptographyService.encrypt(vote)),
        signature,
      }
      const blob = new Blob([JSON.stringify(voteTree)], { type: 'application/json' })
      const file = new File([blob], 'merkleTreeData.json')
      const uploadedFile = await web3StorageClient.uploadFile(file)
      if (uploadedFile) {
        await VoteRecord.create({
          cid: uploadedFile.toString(),
        })
        await RawVote.query().whereIn('id', idsToDelete).delete()
      }
    } catch (error) {
      console.error(error.message)
      return error.message
    }
  }

  public async batchCount() {
    try {
      const voteRecord = await VoteRecord.query()
        .where('viewed', 0)
        .where('counted', 0)
        .where('tallied', 0)
        .orderBy('id', 'asc')
        .first()
      if (!voteRecord) {
        throw new Error('No active recorded votes.')
      }
      const cid = voteRecord.cid
      voteRecord.viewed = true
      const res = await fetch(`https://w3s.link/ipfs/${cid}`)
      const arrayBuffer = await res.arrayBuffer()
      const { root, votes, leaves, signature } = JSON.parse(Buffer.from(arrayBuffer).toString())
      const validSignature = this.cryptographyService.verifyLocalSignature(root, signature)
      if (!validSignature) {
        throw new Error('Invalid Signature.')
      }
      const leafBuffers = leaves.map((leaf: string) => Buffer.from(leaf, 'hex'))
      const reconstructedTree = new MerkleTree(leafBuffers, keccak256, { sortPairs: true })
      const validVotes: string[] = []
      votes.forEach((vote: string) => {
        const decryptedVote = this.cryptographyService.decrypt(vote)
        const hashedVote = keccak256(Buffer.from(decryptedVote))
        const proof = reconstructedTree.getProof(hashedVote)
        const isValid = reconstructedTree.verify(proof, hashedVote, root)
        if (isValid) {
          validVotes.push(decryptedVote)
        }
      })
      const clusteredVotes = validVotes.reduce(
        (acc: Record<string, number>, candidate: string) => {
          acc[candidate] = (acc[candidate] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
      const formattedVotes = Object.entries(clusteredVotes).map(([candidate, vote]) => ({
        candidate,
        vote,
      }))
      voteRecord.counted = true
      if (formattedVotes.length === 0) {
        return
      }
      for (const { candidate, vote } of formattedVotes) {
        await VoteTally.create({
          candidate,
          vote,
          batch: voteRecord.id,
          signature: this.cryptographyService.sign(env.get('VOTE_TALLY_SIGNATURE_DATA')),
        })
      }

      voteRecord.tallied = true
      await voteRecord.save()
    } catch (error) {
      console.error(error.message)
      return error.message
    }
  }

  public async countTotalVotes() {
    const result = await VoteTally.query().count('* as total')
    return Number(result[0].$extras.total) || 0
  }
}
