import crypto from 'node:crypto'

export default class HashingService {
  public makeHash(text: string) {
    return crypto.createHash('sha256').update(text.trim()).digest('hex')
  }
}
