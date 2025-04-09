import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VoteTally extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare candidate: string

  @column()
  declare vote: number

  @column()
  declare batch: number

  @column({
    prepare(value: string) {
      return Buffer.from(value)
    },
    consume(value: string) {
      return value.toString()
    },
  })
  declare signature: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
