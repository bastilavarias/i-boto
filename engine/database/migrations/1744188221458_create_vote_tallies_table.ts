import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vote_tallies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('candidate').index()
      table.integer('vote')
      table.integer('batch')
      table.binary('signature')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('candidate').references('code').inTable('candidates')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
