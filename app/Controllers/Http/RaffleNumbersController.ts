import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import RaffleNumber from 'App/Models/RaffleNumber'

export default class RaffleNumbersController {
  public async index({ response }: HttpContextContract) {
    try {
      const raffleActive = await Raffle.findBy('status', true)

      if (raffleActive) {
        const raffleNumbres = await RaffleNumber.query().where('raffle_id', raffleActive.id)
        return response.status(200).send(raffleNumbres)
      } else {
        return response.status(200).send({ message: 'Nenhuma rifa ativa no momento!' })
      }
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  //public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const body = request.only(['clientId', 'rifaId', 'number'])
      //verificar se todos os numeros estão disponiveis
      const numbersAlreadyBuy: number[] = []

      for (let i = 0; i < body.number.length; i++) {
        const number = await RaffleNumber.query()
          .where('number', body.number[i])
          .where('raffle_id', body.rifaId)
        if (number[0]?.clientId != null) {
          numbersAlreadyBuy.push(number[0].number)
        }
      }

      if (numbersAlreadyBuy.length == 0) {
        // Pode comprar
        for (let i = 0; i < body.number.length; i++) {
          const number = await RaffleNumber.query()
            .where('number', body.number[i])
            .where('raffle_id', body.rifaId)
          if (number) {
            number[0].clientId = body.clientId
            number[0].save()
          }
        }
        return response.status(200).send({ message: 'Compra efetuada com sucesso!' })
      } else {
        return response
          .status(200)
          .send({ message: `Número ${numbersAlreadyBuy.join(', ')} já foi comprado!` })
      }
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }



  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    try {
      const raffle = await Raffle.findOrFail(id)
      raffle.status = false
      raffle.save()
      return response.status(200).send({ message: 'Rifa encerrada!' })
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }
}
