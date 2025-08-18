import {DBServiceTest} from '../_db'
import {UserDBService} from './userDB.service'

export class UserDBServiceTest {
  private dbService = DBServiceTest.dbService

  public userDBService = new UserDBService(this.dbService)
}
