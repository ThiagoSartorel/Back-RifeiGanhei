import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'

export default class Raffle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public status: boolean

  @column()
  public quantity: number

  @column()
  public price: number

  @column()
  public image: string

  @column()
  public sortNumber: number

  @column()
  public winnerName: string

  @column.dateTime()
  public sortDate: DateTime

  @column()
  public winner: number
  @belongsTo(()=> Client)
  public winner_id: BelongsTo<typeof Client>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
