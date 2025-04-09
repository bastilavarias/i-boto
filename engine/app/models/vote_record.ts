import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VoteRecord extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cid: string

  @column()
  declare viewed: boolean

  @column()
  declare counted: boolean

  @column()
  declare tallied: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
