import type { HttpContext } from '@adonisjs/core/http'
import { createVerify } from 'node:crypto'

export default class VoteController {
  public async process({ request, response }: HttpContext) {
    try {
      let { vote, sig, pubKey } = request.only(['vote', 'sig', 'pubKey'])
      const isValidSignature = this.verifySignature(vote, sig, pubKey)
      if (!isValidSignature) {
        throw new Error('Invalid vote signature.')
      }
      return response.status(200).json({
        message: 'Valid vote signature!',
      })
    } catch (error) {
      return response.unauthorized({ message: 'Process vote failed. Please try again later.' })
    }
  }

  private verifySignature(vote: any, signature: string, pubKeyBase64: string): boolean {
    const voteString = JSON.stringify(vote)
    const verifier = createVerify('RSA-SHA256')

    verifier.update(voteString)
    verifier.end()

    const publicKeyPem = this.formatSpkiToPem(pubKeyBase64)

    return verifier.verify(publicKeyPem, Buffer.from(signature, 'base64'))
  }

  private formatSpkiToPem(base64Key: string): string {
    const chunks = base64Key.match(/.{1,64}/g) || []
    return `-----BEGIN PUBLIC KEY-----\n${chunks.join('\n')}\n-----END PUBLIC KEY-----`
  }
}
