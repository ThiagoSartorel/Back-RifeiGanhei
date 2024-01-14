import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'raffles'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('sort_date', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('sort_date')
    })
  }
}
