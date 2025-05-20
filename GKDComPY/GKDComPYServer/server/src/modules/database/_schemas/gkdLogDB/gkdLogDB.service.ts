import {Injectable} from '@nestjs/common'
import {Model, Types} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {GKDLog} from './gkdLogDB.entity'
import {LogType} from 'src/common/types'

@Injectable()
export class GKDLogDBService {
  constructor(@InjectModel(GKDLog.name) private readonly logModel: Model<GKDLog>) {}

  async createLog(where: string, uOId: string, userId: string, gkdLog: string, gkdStatus: Object) {
    try {
      const date = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Seoul'}))
      const newLog = new this.logModel({date, where, uOId, userId, gkdLog, gkdStatus})
      await newLog.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
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

  async createGKDErr(
    where: string,
    uOId: string,
    userId: string,
    gkdErr: string,
    gkdStatus: Object
  ) {
    try {
      const newGKDErr = new this.logModel({where, uOId, userId, gkdErr, gkdStatus})
      await newGKDErr.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(`${where}: ${userId} 의 gkdErr 로깅실패. 원래 메시지: ${gkdErr}`)
      Object.keys(errObj).map(key => {
        console.log(`  [${key}]: ${errObj[key]}`)
      })
      throw errObj
    }
  }

  /**
   * gkd 에러가 아니라는건 예상한 에러가 아니라는 뜻이다. \
   * gkdStatus 를 넣어줄 수 없다.
   */
  async createGKDErrObj(where: string, uOId: string, userId: string, gkdErrObj: Object) {
    try {
      const newErrObj = new this.logModel({where, uOId, userId, gkdErrObj})
      await newErrObj.save()
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(`${where}: ${userId} 의 errObj 로깅 실패`)
      Object.keys(gkdErrObj).map(key => console.log(`  ${key}: ${gkdErrObj[key]}`))
      throw errObj
    }
  }

  async readLogsArr() {
    try {
      const logsArrDB = await this.logModel.find({})
      const logsArr: LogType[] = logsArrDB.map(log => {
        const {date, dateValue, errObj, gkd, gkdErr} = log
        const {gkdLog, gkdStatus, uOId, userId, where} = log
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
          uOId,
          userId,
          where
        }
        return elem
      })
      return {logsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
