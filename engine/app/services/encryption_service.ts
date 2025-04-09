import crypto from 'node:crypto'
import env from '#start/env'

const ALGORITHM = env.get('ENCRYPTION_ALGORITHM') as string
const SALT_LENGTH = env.get('ENCRYPTION_SALT') as number
const IV_LENGTH = env.get('ENCRYPTION_IV') as number
const TAG_LENGTH = env.get('ENCRYPTION_TAG') as number
const ITERATIONS = env.get('ENCRYPTION_ITERATIONS') as number
const KEY_LENGTH = env.get('ENCRYPTION_KEY') as number
const ENCRYPTION_PASSWORD = env.get('ENCRYPTION_PASSWORD') as string

export default class EncryptionService {
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
}
