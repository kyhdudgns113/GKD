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
  async createLog(where: string, uOId: string, gkdLog: string, gkdStatus: Object, logInId?: string) {
    // 로그인을 할 때는 uOId 가 당연히 없다.
    where = where + ':createLog'
    try {
      let userId = 'NULL ID'

      if (uOId) {
        const {user} = await this.dbHubService.readUserByUOId(where, uOId)
        if (!user) {
          const gkdStatus = {uOId}
          const gkdErr = `로그 쓰는데 ${uOId} 유저가 없어요`
          await this.dbHubService.createGKDErr(where, uOId, 'ERROR_ID', gkdErr, gkdStatus)
          throw {gkd: {uOId: `로그 쓰는데 이런 유저가 없어요`}, gkdStatus, where}
        }

        userId = user.id
      } // BLANK LINE COMMENT:
      else if (logInId) {
        userId = logInId
      }

      await this.dbHubService.createLog(where, uOId, userId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createGKDErr(
    where: string,
    uOId: string,
    gkdErr: string,
    gkdStatus: Object,
    logInId?: string
  ) {
    // 로그인을 할 때는 uOId 가 당연히 없다.
    where = where + ':createGKDErr'
    try {
      let userId = 'NULL ID'

      if (uOId) {
        const {user} = await this.dbHubService.readUserByUOId(where, uOId)
        if (!user) {
          const gkdStatus = {uOId}
          const gkdErr = `gkdErr 쓰는데 ${uOId} 유저가 없어요`
          await this.dbHubService.createGKDErr(where, uOId, 'ERROR_ID', gkdErr, gkdStatus)
          throw {gkd: {uOId: `gkdErr 쓰는데 이런 유저가 없어요`}, gkdStatus, where}
        }
        userId = user.id
      } // BLANK LINE COMMENT:
      else if (logInId) {
        userId = logInId
      }

      await this.dbHubService.createGKDErr(where, uOId, userId, gkdErr, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createGKDErrObj(where: string, uOId: string, gkdErrObj: Object, logInId?: string) {
    // 로그인을 할 때는 uOId 가 당연히 없다.
    where = where + ':createGKDErrObj'
    try {
      let userId = 'NULL ID'

      if (uOId) {
        const {user} = await this.dbHubService.readUserByUOId(where, uOId)
        if (!user) {
          const gkdStatus = {uOId}
          const gkdErr = `errObj 쓰는데 ${uOId} 유저가 없어요`
          await this.dbHubService.createGKDErr(where, uOId, 'ERROR_ID', gkdErr, gkdStatus)
          throw {gkd: {uOId: `errObj 쓰는데 이런 유저가 없어요`}, gkdStatus, where}
        }
        userId = user.id
      } // BLANK LINE COMMENT:
      else if (logInId) {
        userId = logInId
      }

      await this.dbHubService.createGKDErrObj(where, uOId, userId, gkdErrObj)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
