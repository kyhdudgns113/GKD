import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@utils'

import * as DTO from '@dtos'
import * as T from '@common/types'
import * as V from '@values'

@Injectable()
export class AlarmDBService {
  constructor(private readonly dbService: DBService) {}

  async createAlarm(where: string, dto: DTO.CreateAlarmDTO) {
    const connection = await this.dbService.getConnection()

    try {
      let alarmOId = generateObjectId()

      while (true) {
        const query = `SELECT alarmOId FROM alarms WHERE alarmOId = ?`
        const [result] = await connection.execute(query, [alarmOId])
        const resultArr = result as RowDataPacket[]

        if (resultArr.length === 0) break
        alarmOId = generateObjectId()
      }

      const query = `INSERT INTO alarms (alarmOId, alarmType, content, fileOId, senderUserName, senderUserOId, userOId) VALUES (?, ?, ?, ?, ?, ?, ?)`
      const params = [alarmOId, dto.alarmType, dto.content, dto.fileOId, dto.senderUserName, dto.senderUserOId, dto.userOId]
      await connection.execute(query, params)

      return {alarmOId}
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

  async readAlarmArrByUserOId(where: string, userOId: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM alarms WHERE userOId = ? ORDER BY createdAt DESC`
      const [result] = await connection.execute(query, [userOId])
      const resultArr = result as RowDataPacket[]

      const alarmArr: T.AlarmType[] = resultArr.map(row => {
        const {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, senderUserName, senderUserOId, userOId} = row
        const alarm: T.AlarmType = {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, senderUserName, senderUserOId, userOId}
        return alarm
      })

      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateAlarmStatusOld(where: string, checkedAlarmArr: T.AlarmType[]) {
    const connection = await this.dbService.getConnection()

    try {
      if (checkedAlarmArr.length === 0) return

      const query = `
        UPDATE alarms 
        SET alarmStatus = ? 
        WHERE alarmOId IN (${checkedAlarmArr.map(() => '?').join(',')})
      `
      const params = [V.ALARM_STATUS_OLD, ...checkedAlarmArr.map(alarm => alarm.alarmOId)]
      await connection.execute(query, params)
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
