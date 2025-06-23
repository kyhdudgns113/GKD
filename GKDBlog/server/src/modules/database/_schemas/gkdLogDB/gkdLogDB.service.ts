import {Injectable} from '@nestjs/common'
import {Model, Types} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {GKDLog} from './gkdLogDB.entity'
import {LogType} from '@common/types'

@Injectable()
export class GKDLogDBService {
  constructor(@InjectModel(GKDLog.name) private readonly logModel: Model<GKDLog>) {}

  async createLog(where: string, userOId: string, userId: string, gkdLog: string, gkdStatus: Object) {
    try {
      const date = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Seoul'}))
      const newLog = new this.logModel({date, where, userOId, userId, gkdLog, gkdStatus})
      await newLog.save()
      // ::
    } catch (errObj) {
      // ::
      console.log(`${where}: ${userId} 의 로깅실패. 원래 메시지: ${gkdLog}`)
      Object.keys(errObj).map(key => {
        console.log(`  [${key}]: ${errObj[key]}`)
      })
      if (errObj.errors) {
        Object.keys(errObj.errors).map(key => {
          console.log(`  ${key}:${errObj.errors[key]}`)
        })
      }
      throw errObj
    }
  }

  async createGKDErr(where: string, userOId: string, userId: string, gkdErr: string, gkdStatus: Object) {
    try {
      const newGKDErr = new this.logModel({where, userOId, userId, gkdErr, gkdStatus})
      await newGKDErr.save()
      // ::
    } catch (errObj) {
      // ::
      console.log(`${where}: ${userId} 의 gkdErr 로깅실패. 원래 메시지: ${gkdErr}`)
      Object.keys(errObj).map(key => {
        if (Object.keys([key]).length >= 1) {
          Object.keys(errObj[key]).map(key2 => {
            console.log(`  [${key}][${key2}]: ${errObj[key][key2]}`)
          })
        } // ::
        else {
          console.log(`  [${key}]: ${errObj[key]}`)
        }
      })
      throw errObj
    }
  }

  /**
   * gkd 에러가 아니라는건 예상한 에러가 아니라는 뜻이다. \
   * gkdStatus 를 넣어줄 수 없다.
   */
  async createGKDErrObj(where: string, userOId: string, userId: string, gkdErrObj: Object) {
    try {
      const newErrObj = new this.logModel({where, userOId, userId, gkdErrObj})
      await newErrObj.save()
      // ::
    } catch (errObj) {
      // ::
      console.log(`${where}: ${userId} 의 errObj 로깅 실패`)
      Object.keys(errObj).map(key => {
        if (Object.keys([key]).length >= 1) {
          Object.keys(errObj[key]).map(key2 => {
            console.log(`  [${key}][${key2}]: ${errObj[key][key2]}`)
          })
        } // ::
        else {
          console.log(`  [${key}]: ${errObj[key]}`)
        }
      })
      throw errObj
    }
  }

  async readLogsArr() {
    try {
      const logsArrDB = await this.logModel.find({})
      const logsArr: LogType[] = logsArrDB.map(log => {
        const {date, dateValue, errObj, gkd, gkdErr} = log
        const {gkdLog, gkdStatus, userOId, userId, where} = log
        const logOId = log._id.toString()
        const elem: LogType = {
          date,
          dateValue,
          errObj,
          gkd,
          gkdErr,
          gkdLog,
          gkdStatus,
          logOId,
          userOId,
          userId,
          where
        }
        return elem
      })
      return {logsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
