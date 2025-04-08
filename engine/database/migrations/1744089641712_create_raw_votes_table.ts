import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'raw_votes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.binary('vote')
      table.binary('signature')
      table.binary('public_key')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
