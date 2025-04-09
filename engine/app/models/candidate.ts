import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import VoteTally from '#models/vote_tally'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Candidate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare placement: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare party: string

  @column()
  declare position: string

  @column()
  declare electionYear: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => VoteTally, {
    foreignKey: 'candidate',
    localKey: 'code',
  })
  public voteTallies!: HasMany<typeof VoteTally>
}
