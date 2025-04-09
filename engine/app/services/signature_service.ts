import crypto from 'node:crypto'
import env from '#start/env'

export default class SignatureService {
  public sign(data: string): string {
    const privateKey = env.get('PRIVATE_KEY') as string
    const signature = crypto.sign('sha256', Buffer.from(data), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    })

    return signature.toString('base64')
  }

  public verifyClientSignature(vote: string, signature: string, pubKeyBase64: string): boolean {
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(vote)
    verifier.end()
    const publicKeyPem = this.formatSPKIToPEM(pubKeyBase64)

    return verifier.verify(publicKeyPem, Buffer.from(signature, 'base64'))
  }

  public verifyLocalSignature(data: string, signature: string): boolean {
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

  private formatSPKIToPEM(base64Key: string): string {
    const chunks = base64Key.match(/.{1,64}/g) || []
    return `-----BEGIN PUBLIC KEY-----\n${chunks.join('\n')}\n-----END PUBLIC KEY-----`
  }
}
