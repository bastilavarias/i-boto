import crypto from 'node:crypto'
import env from '#start/env'

const ALGORITHM = env.get('ENCRYPTION_ALGORITHM') as string
const SALT_LENGTH = env.get('ENCRYPTION_SALT') as number
const IV_LENGTH = env.get('ENCRYPTION_IV') as number
const TAG_LENGTH = env.get('ENCRYPTION_TAG') as number
const ITERATIONS = env.get('ENCRYPTION_ITERATIONS') as number
const KEY_LENGTH = env.get('ENCRYPTION_KEY') as number
const ENCRYPTION_PASSWORD = env.get('ENCRYPTION_PASSWORD') as string

export default class CryptographyService {
  public encrypt(plaintext: string): string {
    const salt = crypto.randomBytes(SALT_LENGTH)
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, salt, ITERATIONS, KEY_LENGTH, 'sha512')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    //@ts-ignore
    const tag = cipher.getAuthTag()
    const combined = Buffer.concat([salt, iv, tag, encrypted])

    return combined.toString('base64')
  }

  public decrypt(ciphertext: string): string {
    const combined = Buffer.from(ciphertext, 'base64')
    const salt = combined.subarray(0, SALT_LENGTH)
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const key = crypto.pbkdf2Sync(ENCRYPTION_PASSWORD, salt, ITERATIONS, KEY_LENGTH, 'sha512')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    //@ts-ignore
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted.toString('utf8')
  }

  public makeHash(text: string) {
    return crypto.createHash('sha256').update(text.trim()).digest('hex')
  }

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
