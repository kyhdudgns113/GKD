import {model} from 'mongoose'
import {PokerUser, PokerUserSchema} from './pokerUserDB.entity'
import {PokerUserDBService} from './pokerUserDB.service'

export class PokerUserDBTest {
  private pokerUserDBModel = model(PokerUser.name, PokerUserSchema)

  public pokerUserDBService = new PokerUserDBService(this.pokerUserDBModel)
}
