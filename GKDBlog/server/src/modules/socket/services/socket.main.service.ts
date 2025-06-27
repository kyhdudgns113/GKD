import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'
import {ClientPortService, SocketPortService} from 'src/modules/database/ports'
import {GKDLockService} from 'src/modules/gkdLock/gkdLock.service'
import {SocketInfoService} from './socket.info.service'

import * as T from '@common/types'
import * as S from '@common/types/socketTypes'

@Injectable()
export class SocketMainService {
  constructor(
    private readonly infoService: SocketInfoService,
    private readonly portService: SocketPortService
  ) {}

  // AREA1: Socket
  async connectUserMainSocket(client: Socket, payload: S.MainSocketConnectType) {
    const {userOId} = payload
    this.infoService.joinSocketToMain(client, userOId)
  }
  async disconnectSocket(client: Socket) {
    this.infoService.leaveSocketFromUser(client)
  }

  // AREA2: Service Area
  async alarmReadingComment(server: Server, fileUserOId: string, comment: T.CommentType) {
    /**
     * 1. portService 에 알람정보를 전달한다.
     * 2. fileUserOId 의 소켓들에게 메시지를 보낸다.
     */
    try {
      const {newAlarmArrLen} = await this.portService.alarmReadingComment(fileUserOId, comment)

      const {mainSocketsArr} = this.infoService.getMainSockets(server, fileUserOId)
      mainSocketsArr.forEach(socket => {
        socket.emit('setAlarmLen', newAlarmArrLen)
      })
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async alarmReadingReply(server: Server, targetUserOId: string, reply: T.ReplyType) {
    /**
     * 1. portService 에 알람정보를 전달한다.
     * 2. targetUserOId 의 소켓들에게 메시지를 보낸다.
     */
    try {
      const {newAlarmArrLen} = await this.portService.alarmReadingReply(targetUserOId, reply)

      const {mainSocketsArr} = this.infoService.getMainSockets(server, targetUserOId)
      mainSocketsArr.forEach(socket => {
        socket.emit('setAlarmLen', newAlarmArrLen)
      })
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async refreshAlarmArr(server: Server, userOId: string, receivedAlarmArr: T.AlarmType[]) {
    /**
     * 1. portService 에 갱신할 알람 배열을 전달후, 새로운 수신확인 안 된 알람 갯수를 받는다.
     * 2. userOId 의 소켓들에게 알람 갯수를 보낸다.
     */
    try {
      const {newAlarmArrLen} = await this.portService.updateAlarmArr(userOId, receivedAlarmArr)

      const {mainSocketsArr} = this.infoService.getMainSockets(server, userOId)
      mainSocketsArr.forEach(socket => {
        socket.emit('setAlarmLen', newAlarmArrLen)
      })
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
}
