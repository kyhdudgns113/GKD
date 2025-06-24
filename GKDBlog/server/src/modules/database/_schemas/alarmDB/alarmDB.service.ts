import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {AlarmDB} from './alarmDB.entity'
import {Model, Types} from 'mongoose'

import * as T from '@common/types'

@Injectable()
export class AlarmDBService {
  constructor(@InjectModel(AlarmDB.name) private alarmDBModel: Model<AlarmDB>) {}

  async createAlarmReadingComment(where: string, fileUserOId: string, comment: T.CommentType) {
    try {
      const targetUserOId = fileUserOId
      const targetObjectId = comment.fileOId
      const sendUserOId = comment.userOId
      const sendUserName = comment.userName
      const content = comment.content
      const date = new Date()
      const dateString = date.toISOString()
      const type = 'readingComment'

      const alarmDB = await this.alarmDBModel.create({
        targetUserOId,
        targetObjectId,
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
        targetObjectId,
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
  async createAlarmReadingReply(where: string, targetObjectId: string, targetUserOId: string, reply: T.ReplyType) {
    try {
      const date = new Date()
      const dateString = date.toISOString()
      const type = 'readingReply'

      const alarmDB = await this.alarmDBModel.create({
        targetUserOId,
        targetObjectId,
        sendUserOId: reply.userOId,
        sendUserName: reply.userName,
        content: reply.content,
        date,
        dateString,
        type
      })
      const alarm: T.AlarmType = {
        alarmOId: alarmDB._id.toString(),
        content: reply.content,
        date,
        dateString,
        isReceived: false,
        sendUserOId: reply.userOId,
        sendUserName: reply.userName,
        targetObjectId,
        targetUserOId,
        type
      }
      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async readAlarm(where: string, alarmOId: string) {
    try {
      const _id = new Types.ObjectId(alarmOId)
      const alarmDB = await this.alarmDBModel.findOne({_id})
      if (!alarmDB) {
        return {alarm: null}
      }

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
      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
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
    /**
     * 수신 확인이 안 된 알람들의 배열을 리턴한다.
     * - 알람버튼 누르면 다른데에서 수신이 되었다며 isReceived 를 true 로 바꿔준다.
     */
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

  async updateAlarmArrReceived(where: string, receivedAlarmArr: T.AlarmType[]) {
    try {
      await this.alarmDBModel.updateMany({_id: {$in: receivedAlarmArr.map(alarm => new Types.ObjectId(alarm.alarmOId))}}, {$set: {isReceived: true}})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteAlarm(where: string, alarmOId: string) {
    try {
      const _id = new Types.ObjectId(alarmOId)
      await this.alarmDBModel.deleteOne({_id})
      // ::// ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
