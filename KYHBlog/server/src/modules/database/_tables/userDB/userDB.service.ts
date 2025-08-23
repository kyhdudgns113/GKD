import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'

import * as DTO from '@dtos'
import * as bcrypt from 'bcrypt'

import {generateObjectId} from '@utils'
import {RowDataPacket} from 'mysql2'
import {UserType} from '@shareTypes'
import {AUTH_ADMIN, AUTH_USER, gkdSaltOrRounds, USER_ID_ADMIN} from '@secrets'
import * as T from '@common/types'

@Injectable()
export class UserDBService {
  constructor(private readonly dbService: DBService) {}

  async createUser(where: string, dto: DTO.SignUpDTO) {
    where = where + '/createUser'

    /**
     * 1. userOId 생성 (미중복 나올때까지 반복)
     * 2. 비밀번호 해싱
     * 3. 유저 생성
     * 4. 유저 타입으로 변환 및 리턴
     */
    const {userId, userMail, userName, password, picture, signUpType} = dto

    try {
      let userOId = generateObjectId()

      // 1. userOId 생성(미중복 나올때까지 반복)
      try {
        while (true) {
          const {user} = await this.readUserByUserOId(where, userOId)
          if (user) {
            userOId = generateObjectId()
          } // ::
          else {
            break
          }
        }
        // ::
      } catch (errObj) {
        // ::
        throw errObj
      }

      // 2. 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, gkdSaltOrRounds)

      const userAuth = userId === USER_ID_ADMIN ? AUTH_ADMIN : AUTH_USER

      // 3. 유저 생성
      const query = `INSERT INTO users (userOId, hashedPassword, picture, signUpType, userAuth, userId, userMail, userName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      const params = [userOId, hashedPassword, picture, signUpType, userAuth, userId, userMail, userName]
      await this.dbService.getConnection().execute(query, params)
      // ::

      // 4. 유저 타입으로 변환 및 리턴
      const user: UserType = {userOId, picture, signUpType, userAuth: AUTH_USER, userId, userMail, userName}

      return {user}
      // ::
    } catch (errObj) {
      // ::
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `입력값이 무언가 중복됨`, message: errObj.message},
            gkdErrCode: 'USERDB_createUser_1062',
            gkdErrMsg: `입력값이 무언가 중복됨`,
            gkdStatus: {userId, userName},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }
      }

      throw errObj
    }
  }

  async readUserByUserIdAndPassword(where: string, userId: string, password: string) {
    where = where + '/readUserByUserId'

    try {
      const query = `SELECT * FROM users WHERE userId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [userId])

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {user: null}
      }

      const {hashedPassword, picture, signUpType, userAuth, userMail, userOId, userName} = resultArr[0]

      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)

      if (!isPasswordCorrect) {
        return {user: null}
      }

      const user: UserType = {picture, signUpType, userAuth, userId, userMail, userOId, userName}

      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserOId(where: string, userOId: string) {
    where = where + '/readUserByUserOId'
    /**
     * 1. 쿼리 실행
     * 2. 2명 이상인지 확인
     * 3. 없으면 null 리턴
     * 4. 유저 타입으로 변환 및 리턴
     */
    try {
      // 1. 쿼리 실행
      const query = `SELECT * FROM users WHERE userOId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [userOId])

      const resultArr = result as RowDataPacket[]

      // 2. 2명 이상인지 확인
      if (resultArr.length > 1) {
        throw {
          gkd: {userOId: `하나의 userOId에 대해 2명 이상의 유저가 존재합니다.`},
          gkdErrCode: 'USERDB_readUserByUserOId',
          gkdErrMsg: `userOId 중복 오류`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      // 3. 없으면 null 리턴
      if (resultArr.length === 0) {
        return {user: null}
      }

      // 4. 유저 타입으로 변환 및 리턴
      const {picture, signUpType, userAuth, userId, userMail, userName} = resultArr[0]
      const user: UserType = {userOId, picture, signUpType, userAuth, userId, userMail, userName}

      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
