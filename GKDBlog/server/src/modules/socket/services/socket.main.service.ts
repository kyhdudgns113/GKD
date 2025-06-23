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
    private readonly clientService: ClientPortService,
    private readonly infoService: SocketInfoService,
    private readonly lockService: GKDLockService,
    private readonly portService: SocketPortService
  ) {}

  // AREA1: Socket
  async connectUserMainSocket(client: Socket, payload: S.MainSocketConnectType) {
    const {userOId} = payload
    this.infoService.joinSocketToUser(client, userOId)
  }
  async disconnectSocket(client: Socket) {
    this.infoService.leaveSocketFromUser(client)
  }

  // AREA2: Service Area
  async alarmReadingComment(server: Server, fileUserOId: string, comment: T.CommentType) {
    /**
     * 1. portService 에 알람정보를 전달한다.
     * 2. fileUserOId 의 소켓들에게 알람을 보낸다.
     */
    try {
      const {newAlarmArrLen} = await this.portService.alarmReadingComment(fileUserOId, comment)

      const socketsArr = this.infoService.getUserSockets(server, fileUserOId)
      socketsArr.forEach(socketId => {
        server.to(socketId).emit('setAlarmLen', newAlarmArrLen)
      })
      console.log(`    클라이언트에서 이 메시지 받는거 구현 안했다.`)
      console.log(`    클라이언트에서 이 메시지 받는거 구현 안했다.`)
      console.log(`    클라이언트에서 이 메시지 받는거 구현 안했다.`)
      console.log(`    클라이언트에서 이 메시지 받는거 구현 안했다.`)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async alarmReadingReply() {
    //
  }
}
