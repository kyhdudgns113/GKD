import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {UserDB} from './userDB.entity'
import {Model, Types} from 'mongoose'
import {UserType} from '@common/types/shareTypes'
import * as bcrypt from 'bcrypt'
import {adminUserId, AUTH_ADMIN, AUTH_USER} from '@common/secret'

@Injectable()
export class UserDBService {
  constructor(@InjectModel(UserDB.name) private userModel: Model<UserDB>) {}

  async createUser(where: string, userId: string, userName: string, hashedPassword: string) {
    try {
      const signUpType = 'local'
      const userAuth = userId === adminUserId ? AUTH_ADMIN : AUTH_USER
      const newUser = new this.userModel({
        userAuth,
        userId,
        userName,
        hashedPassword,
        signUpType
      })
      const userDB = await newUser.save()
      const userOId = userDB._id.toString()
      const user: UserType = {userAuth, userId, userName, userOId, signUpType}
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createUserGoogle(where: string, userId: string, userName: string, picture: string) {
    try {
      const signUpType = 'google'
      const newUser = new this.userModel({
        userId,
        userName,
        picture,
        signUpType
      })
      const userDB = await newUser.save()
      const userOId = userDB._id.toString()
      const user: UserType = {userAuth: 1, userId, userName, picture, userOId, signUpType}
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readUserAuthByUserId(where: string, userId: string) {
    where = where + '/readUserAuthByUserId'
    try {
      const userDB = await this.userModel.findOne({userId})
      if (!userDB) {
        const res = await this.userModel.find({})
        throw {gkd: {userId: '존재하지 않는 유저ID 입니다.'}, gkdStatus: {userId}, where}
      }

      const {userAuth} = userDB
      return {userAuth}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserId(where: string, userId: string) {
    where = where + '/readUserByUserId'
    try {
      const userDB = await this.userModel.findOne({userId})
      if (!userDB) {
        return {user: null}
      }
      const {userAuth, userName, _id} = userDB
      const userOId = _id.toString()
      const user: UserType = {userAuth, userId, userName, userOId}
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserIdAndPassword(where: string, userId: string, password: string) {
    where = where + '/readUserByUserIdAndPassword'
    try {
      const userDB = await this.userModel.findOne({userId})
      if (!userDB) {
        throw {gkd: {userId: '존재하지 않는 유저ID 입니다.'}, gkdStatus: {userId}, where}
      }
      const isPasswordCorrect = await bcrypt.compare(password, userDB.hashedPassword)
      if (!isPasswordCorrect) {
        throw {gkd: {password: '비밀번호가 일치하지 않습니다.'}, gkdStatus: {userId}, where}
      }

      const {picture, userAuth, userName, _id} = userDB
      const userOId = _id.toString()

      const user: UserType = {userAuth, picture, userId, userName, userOId}
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserName(where: string, userName: string) {
    where = where + '/readUserByUserName'
    try {
      const userDB = await this.userModel.findOne({userName})
      if (!userDB) {
        return {user: null}
      }
      const {userAuth, userId, _id} = userDB
      const userOId = _id.toString()
      const user: UserType = {userAuth, userId, userName, userOId}
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserOId(where: string, userOId: string) {
    where = where + '/readUserByUserOId'
    try {
      const _id = new Types.ObjectId(userOId)
      const userDB = await this.userModel.findOne({_id})
      if (!userDB) {
        throw {gkd: {userOId: '존재하지 않는 유저OID 입니다.'}, gkdStatus: {userOId}, where}
      }
      const {userAuth, userId, userName} = userDB
      const user: UserType = {userAuth, userId, userName, userOId}
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
