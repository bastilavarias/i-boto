import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import RawVote from '#models/raw_vote'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import web3StorageClient from '#start/web3_storage'
import env from '#start/env'

const ALGORITHM = env.get('ENCRYPTION_ALGORITHM') as string
const SALT_LENGTH = env.get('ENCRYPTION_SALT') as number
const IV_LENGTH = env.get('ENCRYPTION_IV') as number
const TAG_LENGTH = env.get('ENCRYPTION_TAG') as number
const ITERATIONS = env.get('ENCRYPTION_ITERATIONS') as number
const KEY_LENGTH = env.get('ENCRYPTION_KEY') as number
const ENCRYPTION_PASSWORD = env.get('ENCRYPTION_PASSWORD') as string

export default class VoteController {
  public async create({ request, response }: HttpContext) {
    try {
      let { vote, sig, pubKey } = request.only(['vote', 'sig', 'pubKey'])
      const isValidSignature = this.verifySignature(JSON.stringify(vote), sig, pubKey)
      if (!isValidSignature) {
        throw new Error('Invalid vote signature.')
      }
      const encryptedVote = {
        ...vote,
        candidates: vote.candidates.map((candidate: string) => this.encrypt(candidate)),
      }
      await RawVote.create({
        vote: JSON.stringify(encryptedVote),
        signature: sig,
        publicKey: pubKey,
      })

      return response.status(200).json({
        message: 'Valid vote signature!',
      })
    } catch (error) {
      console.log(error.message)
      return response.unauthorized({ message: 'Process vote failed. Please try again later.' })
    }
  }

  public async process() {
    try {
      const rawVotes = await RawVote.all()
      let validRawVotes: RawVote[] = []
      let idsToDelete: number[] = []
      rawVotes.forEach((rawVote) => {
        const { vote, signature, publicKey } = rawVote
        const parsedVote = JSON.parse(vote)
        const decryptedVoteData = {
          ...parsedVote,
          candidates: parsedVote.candidates.map((candidate: string) => this.decrypt(candidate)),
        }
        const isValidSignature = this.verifySignature(
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
      const votes = validRawVotes.map(({ vote }) => vote.candidates).flat()
      const leaves = votes.map((vote) => keccak256(Buffer.from(vote)))
      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
      const root = tree.getRoot().toString('hex')
      const signature = this.sign(root)
      const voteTree = {
        root,
        leaves: leaves.map((leaf) => leaf.toString('hex')),
        votes: votes.map((vote) => this.encrypt(vote)),
        signature,
      }
      const blob = new Blob([JSON.stringify(voteTree)], { type: 'application/json' })
      const file = new File([blob], 'merkleTreeData.json')
      const uploadedFile = await web3StorageClient.uploadFile(file)
      if (uploadedFile) {
        console.log(uploadedFile)
        // Delete raw votes here
        return true
      }
    } catch (error) {
      return error.message
    }
  }

  public async batchCount() {
    const cid = ''
    const res = await fetch(`https://w3s.link/ipfs/${cid}`)
    const arrayBuffer = await res.arrayBuffer()
    const { root, votes, leaves, signature } = JSON.parse(Buffer.from(arrayBuffer).toString())
    const validSignature = this.verifyLocalSignature(root, signature)
    if (!validSignature) {
      throw new Error('Invalid Signature.')
    }
    const leafBuffers = leaves.map((leaf: string) => Buffer.from(leaf, 'hex'))
    const reconstructedTree = new MerkleTree(leafBuffers, keccak256, { sortPairs: true })
    const validVotes: string[] = []
    votes.forEach((vote: string) => {
      const decryptedVote = this.decrypt(vote)
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

    console.log(clusteredVotes)
  }

  private verifySignature(vote: string, signature: string, pubKeyBase64: string): boolean {
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(vote)
    verifier.end()
    const publicKeyPem = this.formatSpkiToPem(pubKeyBase64)

    return verifier.verify(publicKeyPem, Buffer.from(signature, 'base64'))
  }

  private formatSpkiToPem(base64Key: string): string {
    const chunks = base64Key.match(/.{1,64}/g) || []
    return `-----BEGIN PUBLIC KEY-----\n${chunks.join('\n')}\n-----END PUBLIC KEY-----`
  }

  private encrypt(plaintext: string): string {
    const salt = crypto.randomBytes(SALT_LENGTH)
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, salt, ITERATIONS, KEY_LENGTH, 'sha512')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    const combined = Buffer.concat([salt, iv, tag, encrypted])

    return combined.toString('base64')
  }

  private decrypt(ciphertext: string): string {
    const combined = Buffer.from(ciphertext, 'base64')
    const salt = combined.subarray(0, SALT_LENGTH)
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, salt, ITERATIONS, KEY_LENGTH, 'sha512')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted.toString('utf8')
  }

  private sign(data: string): string {
    const privateKey = env.get('PRIVATE_KEY') as string
    const signature = crypto.sign('sha256', Buffer.from(data), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    })

    return signature.toString('base64')
  }

  private verifyLocalSignature(data: string, signature: string): boolean {
    const publicKey = env.get('PUBLIC_KEY') as string
    const signatureBuffer = Buffer.from(signature, 'base64')
    const isValid = crypto.verify(
      'sha256',
      Buffer.from(data),
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING, // Padding scheme used
      },
      signatureBuffer
    )

    return isValid
  }
}
