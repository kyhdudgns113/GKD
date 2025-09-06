import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'
import {SocketInfoService} from './socket.info.service'
import * as S from '@common/types/socketTypes'

@Injectable()
export class SocketUserService {
  constructor(private readonly infoService: SocketInfoService) {}

  userConnect(server: Server, socket: Socket, payload: S.UserConnectType) {
    this.infoService.joinSocketToUser(socket, payload.userOId)
  }

  userDisconnect(server: Server, socket: Socket) {
    try {
      this.infoService.leaveSocketFromUser(socket)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
