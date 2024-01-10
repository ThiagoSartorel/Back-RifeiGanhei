import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'
import Client from './Client'

export default class RaffleNumber extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public raffleId: number
  @belongsTo(()=> Raffle)
  public raffle_id: BelongsTo<typeof Raffle>

  @column()
  public clientId: number
  @belongsTo(()=> Client)
  public client_id: BelongsTo<typeof Client>

  @column()
  public number: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
