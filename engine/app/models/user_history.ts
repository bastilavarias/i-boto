import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import CryptographyService from '#services/cryptography_service'

export default class UserHistory extends BaseModel {
  private static cryptographyService = new CryptographyService()

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public static async findByUser(user: string) {
    const hash = this.cryptographyService.makeHash(user.toLowerCase())
    return this.query().where('user', hash)
  }
}
