import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RawVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({
    prepare(value: string) {
      return Buffer.from(value)
    },
    consume(value: string) {
      return value.toString()
    },
  })
  declare vote: string

  @column({
    prepare(value: string) {
      return Buffer.from(value)
    },
    consume(value: string) {
      return value.toString()
    },
  })
  declare signature: string

  @column({
    prepare(value: string) {
      return Buffer.from(value)
    },
    consume(value: string) {
      return value.toString()
    },
  })
  declare publicKey: string

  @column()
  declare batch: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
