import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import Raffle from 'App/Models/Raffle'
import RaffleNumber from 'App/Models/RaffleNumber'

export default class ClientsController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  //CADASTRA USUARIO
  public async store({ request, response }: HttpContextContract) {
    try {
      const body = request.only(['phone', 'name'])
      // verifica se já existe
      const alreadyExists = await Client.findBy('phone', body.phone)
      if (alreadyExists) {
        // se existe somente retorna
        return response
          .status(200)
          .send({ message: 'Usuário já está cadastrado no sistema!', user: alreadyExists })
      } else {
        // se não existe cria
        await Client.create({
          name: body.name,
          phone: body.phone,
        })
        return response.status(200).send('Usuário cadastrado com sucesso!')
      }
    } catch (err) {
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  public async myNumbers({ request, response}: HttpContextContract) {
    try{
      const id = request.param('id');
      const activeRaffle = await Raffle.query().where('status', true)

      if(activeRaffle[0]){
        const client = await Client.findBy('phone', id)
        if(client){
          const myNumb = await RaffleNumber.query().where('raffle_id', activeRaffle[0].id).where('client_id', client!.id)
          return response.status(200).send(myNumb)
        }else{
        return response.status(404).send('Cliente não encontrado!')

        }

      }
    }catch(err){
      return response.status(500).send({
        message: 'Ocorreu um erro interno no servidor!',
        detail: err.message,
      })
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
