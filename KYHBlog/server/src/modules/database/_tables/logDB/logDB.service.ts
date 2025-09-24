import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'

import * as T from '@common/types'
import * as DTO from '@dtos'
import {generateObjectId} from '@common/utils'

@Injectable()
export class LogDBService {
  constructor(private readonly dbService: DBService) {}

  async createLog(_where: string, dto: DTO.CreateLogDTO) {
    _where = _where + '/createLog'

    const {errObj, gkd, gkdErr, gkdStatus, gkdLog, userId, userName, userOId, where} = dto

    const connection = await this.dbService.getConnection()

    try {
      let logOId = generateObjectId()
      while (true) {
        const query = `SELECT logOId FROM logs WHERE logOId = ?`
        const [result] = await connection.execute(query, [logOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        logOId = generateObjectId()
      }

      const date = new Date()

      const queryLog = "INSERT INTO logs (logOId, createdAt, userId, userName, userOId, 'where') VALUES (?, ?, ?, ?, ?, ?)"
      const paramsLog = [logOId, date, userId, userName, userOId, where]
      await connection.execute(queryLog, paramsLog)

      // errObj 삽입
      if (errObj && Object.keys(errObj).length > 0) {
        const entries = Object.entries(errObj) // [[key1, value1], [key2, value2], ...]
        const queryErrobj = `
          INSERT INTO errobjs (logOId, \`key\`, \`value\`)
          VALUES ${entries.map(() => '(?, ?, ?)').join(', ')}
        `
        const paramsErrobj = entries.flatMap(([key, value]) => [logOId, key, value])
        await connection.execute(queryErrobj, paramsErrobj)
      }

      // gkd 삽입
      if (gkd && Object.keys(gkd).length > 0) {
        const entries = Object.entries(gkd)
        const queryGkd = `
          INSERT INTO gkds (logOId, \`key\`, \`value\`)
          VALUES ${entries.map(() => '(?, ?, ?)').join(', ')}
        `
        const paramsGkd = entries.flatMap(([key, value]) => [logOId, key, value])
        await connection.execute(queryGkd, paramsGkd)
      }

      // gkdStatus 삽입
      if (gkdStatus && Object.keys(gkdStatus).length > 0) {
        const entries = Object.entries(gkdStatus)
        const queryGkdStatus = `
          INSERT INTO gkdStatus (logOId, \`key\`, \`value\`)
          VALUES ${entries.map(() => '(?, ?, ?)').join(', ')}
        `
        const paramsGkdStatus = entries.flatMap(([key, value]) => [logOId, key, value])
        await connection.execute(queryGkdStatus, paramsGkdStatus)
      }

      const log: T.LogType = {
        logOId,
        date,
        errObj,
        gkd,
        gkdErr,
        gkdLog,
        gkdStatus,
        userId,
        userName,
        userOId,
        where
      }

      return {log}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
}
