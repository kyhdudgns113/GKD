import {model} from 'mongoose'
import {UserDB, UserDBSchema} from './userDB.entity'
import {UserDBService} from './userDB.service'

export class UserDBServiceTest {
  private userModel = model(UserDB.name, UserDBSchema)

  public userDBService = new UserDBService(this.userModel)
}
