import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {AlarmDB} from './alarmDB.entity'
import {Model} from 'mongoose'

import * as T from '@common/types'

@Injectable()
export class AlarmDBService {
  constructor(@InjectModel(AlarmDB.name) private alarmDBModel: Model<AlarmDB>) {}

  async createAlarmReadingComment(where: string, fileUserOId: string, comment: T.CommentType) {
    try {
      const targetUserOId = fileUserOId
      const sendUserOId = comment.userOId
      const sendUserName = comment.userName
      const content = comment.content
      const date = new Date()
      const dateString = date.toISOString()
      const type = 'readingComment'

      const alarmDB = await this.alarmDBModel.create({
        targetUserOId,
        sendUserOId,
        sendUserName,
        content,
        date,
        dateString,
        type
      })
      const alarm: T.AlarmType = {
        alarmOId: alarmDB._id.toString(),
        content,
        date,
        dateString,
        isReceived: false,
        sendUserOId,
        sendUserName,
        targetObjectId: comment.fileOId,
        targetUserOId,
        type
      }

      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readAlarmArr(where: string, targetUserOId: string) {
    /**
     * read
     */
    try {
      const arrDB = await this.alarmDBModel.find({targetUserOId}).sort({date: -1})

      const alarmArr: T.AlarmType[] = arrDB.map(alarmDB => {
        const alarm: T.AlarmType = {
          alarmOId: alarmDB._id.toString(),
          content: alarmDB.content,
          date: alarmDB.date,
          dateString: alarmDB.dateString,
          isReceived: alarmDB.isReceived,
          sendUserOId: alarmDB.sendUserOId,
          sendUserName: alarmDB.sendUserName,
          targetObjectId: alarmDB.targetObjectId,
          targetUserOId: alarmDB.targetUserOId,
          type: alarmDB.type
        }
        return alarm
      })
      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readAlarmArrNotReceived(where: string, targetUserOId: string) {
    try {
      const arrDB = await this.alarmDBModel.find({targetUserOId, isReceived: false}).sort({date: -1})
      const alarmArr: T.AlarmType[] = arrDB.map(alarmDB => {
        const alarm: T.AlarmType = {
          alarmOId: alarmDB._id.toString(),
          content: alarmDB.content,
          date: alarmDB.date,
          dateString: alarmDB.dateString,
          isReceived: alarmDB.isReceived,
          sendUserOId: alarmDB.sendUserOId,
          sendUserName: alarmDB.sendUserName,
          targetObjectId: alarmDB.targetObjectId,
          targetUserOId: alarmDB.targetUserOId,
          type: alarmDB.type
        }
        return alarm
      })
      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
