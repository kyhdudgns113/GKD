import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'

/**
 *
 */
@Injectable()
export class LoggerPortService {
  constructor(private readonly dbHubService: DatabaseHubService) {}

  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createLog(where: string, userOId: string, gkdLog: string, gkdStatus: Object, logInId?: string) {
    // 로그인을 할 때는 userOId 가 당연히 없다.
    where = where + ':createLog'
    try {
      let userId = 'NULL ID'

      if (userOId) {
        const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
        if (!user) {
          const gkdStatus = {userOId}
          const gkdErr = `로그 쓰는데 ${userOId} 유저가 없어요`
          console.log(`createLog: ${gkdErr}`)
          await this.dbHubService.createGKDErr(where, userOId, 'ERROR_ID', gkdErr, gkdStatus)
          throw {gkd: {userOId: `로그 쓰는데 이런 유저가 없어요`}, gkdStatus, where}
        }

        userId = user.userId
      } // BLANK LINE COMMENT:
      else if (logInId) {
        userId = logInId
      }

      await this.dbHubService.createLog(where, userOId, userId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createGKDErr(where: string, userOId: string, gkdErr: string, gkdStatus: Object, logInId?: string) {
    // 로그인을 할 때는 userOId 가 당연히 없다.
    where = where + ':createGKDErr'
    try {
      let userId = 'NULL ID'

      if (userOId) {
        const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
        if (!user) {
          const gkdStatus = {userOId}
          const gkdErr = `gkdErr 쓰는데 ${userOId} 유저가 없어요`
          console.log(`createGKDErr: ${gkdErr}`)
          await this.dbHubService.createGKDErr(where, userOId, 'ERROR_ID', gkdErr, gkdStatus)
          throw {gkd: {userOId: `gkdErr 쓰는데 이런 유저가 없어요`}, gkdStatus, where}
        }
        userId = user.userId
      } // BLANK LINE COMMENT:
      else if (logInId) {
        userId = logInId
      }

      await this.dbHubService.createGKDErr(where, userOId, userId, gkdErr, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createGKDErrObj(where: string, userOId: string, gkdErrObj: Object, logInId?: string) {
    // 로그인을 할 때는 userOId 가 당연히 없다.
    where = where + ':createGKDErrObj'
    try {
      let userId = 'NULL ID'

      if (userOId) {
        const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
        if (!user) {
          const gkdStatus = {userOId}
          const gkdErr = `errObj 쓰는데 ${userOId} 유저가 없어요`
          console.log(`createGKDErrObj: ${gkdErr}`)
          await this.dbHubService.createGKDErr(where, userOId, 'ERROR_ID', gkdErr, gkdStatus)
          throw {gkd: {userOId: `errObj 쓰는데 이런 유저가 없어요`}, gkdStatus, where}
        }
        userId = user.userId
      } // BLANK LINE COMMENT:
      else if (logInId) {
        userId = logInId
      }

      await this.dbHubService.createGKDErrObj(where, userOId, userId, gkdErrObj)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
