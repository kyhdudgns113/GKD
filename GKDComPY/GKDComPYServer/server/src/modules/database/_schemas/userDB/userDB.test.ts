import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {User, UserSchema} from './userDB.entity'
import {UserDBService} from './userDB.service'

export class UserDBServiceTest {
  private userModel = model(User.name, UserSchema)
  public userDBService = new UserDBService(this.userModel)
}
