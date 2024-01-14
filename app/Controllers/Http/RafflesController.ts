import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import Raffle from 'App/Models/Raffle'
import RaffleNumber from 'App/Models/RaffleNumber'
import { DateTime } from 'luxon';

export default class RafflesController {
  public async index({ response }: HttpContextContract) {
    try {
      const raffle = await Raffle.query().where('status', true)
      if(raffle[0] && raffle[0].winner){
        const winner = await Client.find(raffle[0].winner)
        raffle[0].winnerName = winner?.name as unknown as string
      }
      return response.status(200).send(raffle[0])
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
      const body = request.only(['title', 'description', 'quantity', 'price', 'image'])
      const newRaffle = await Raffle.create({
        title: body.title,
        description: body.description,
        status: true,
        quantity: body.quantity,
        price: body.price,
        image: body.image,
      })
      for (let i = 0; i < body.quantity; i++) {
        RaffleNumber.create({ raffleId: newRaffle.id, number: i + 1 })
      }
      return response.status(200).send({ message: 'Rifa cadastrada com sucesso!' })
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  public async winners({ response }: HttpContextContract) {
    try {
      const winners: any[] = []
      const raffleWinners = await Raffle.query().whereNotNull('winner')
      for (let i = 0; i < raffleWinners.length; i++) {
        const winner = await Client.find(raffleWinners[i].winner)
        if (winner) {
          winners.push({ raffle: raffleWinners[i], client: winner })
        }
      }
      return response.status(200).send(winners)
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  public async show({}: HttpContextContract) {}

  //public async edit({}: HttpContextContract) {}

  public async setSortNumber({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const body = request.only(['sortNumber'])
      const raffle = await Raffle.find(id)
      if (raffle) {
        //Nuscar de quem eh o numero
        const winner = await RaffleNumber.query()
          .where('raffle_id', id)
          .andWhere('number', body.sortNumber)
          .first()

        if (winner) {
          raffle.winner = winner.clientId 
        }

        //raffle.status = false
        raffle.sortNumber = body.sortNumber
        await raffle.save()
        return response.status(200).send({ message: 'Ganhador atribuido com sucesso!' })
      }
      return response.status(200).send({ message: 'Rifa não encontrada!' })
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const body = request.only(['title', 'description', 'image', 'price', 'quantity', 'sortNumber', 'sortDate', 'status'])
      const raffle = await Raffle.find(id)

      if (raffle) {
        // Atualiza os campos do raffle com os dados do corpo da solicitação
        raffle.title = body.title || raffle.title
        raffle.description = body.description || raffle.description
        raffle.image = body.image || raffle.image
        raffle.price = body.price || raffle.price
        raffle.quantity = body.quantity || raffle.quantity
        raffle.sortNumber = body.sortNumber || raffle.sortNumber
        raffle.status = body.status || raffle.status
        const date = body.sortDate ? DateTime.fromISO(body.sortDate) : null;
        raffle.sortDate = date || raffle.sortDate;
        

        await raffle.save()

        return response.status(200).send({
          message: 'Rifa atualizada com sucesso!',
          data: raffle,
        })
      } else {
        return response.status(404).send({
          message: 'Rifa não encontrada.',
        })
      }
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  public async destroy({}: HttpContextContract) {}
}
