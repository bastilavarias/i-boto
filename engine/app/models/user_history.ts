import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import HashingService from '#services/hashing_service'

export default class UserHistory extends BaseModel {
  private static hashingService = new HashingService()

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public static async findByUser(user: string) {
    const hash = this.hashingService.makeHash(user.toLowerCase())
    return this.query().where('user', hash)
  }
}
