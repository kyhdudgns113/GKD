import {Server, Socket} from 'socket.io'
import {SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets'
import {SocketUserService} from './services'

import * as T from '@common/types'
import * as S from '@common/types/socketTypes'
import {UseGuards} from '@nestjs/common'
import {CheckSocketJwtGuard} from '@common/guards'
import {GKDJwtService} from '@module/gkdJwt'
import {SendSocketClientMessage, SendSocketRoomMessage} from '@common/utils'

/**
 * SocketGateway
 *
 *   - 소켓메시지 송수신, 소켓서버 관리용으로 쓴다.
 */
@WebSocketGateway({cors: true})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: GKDJwtService,
    private readonly userService: SocketUserService
  ) {}

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]): any {
    // DO NOTHING:
  }
  handleDisconnect(client: Socket, ...args: any[]): any {
    // 해체작업 해줘야 한다.
    try {
      this.userService.userDisconnect(this.server, client)
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] handleDisconnect 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  // AREA1: GKDoubleJWT Validation Area

  @SubscribeMessage('request validation')
  @SendSocketClientMessage('response validation')
  async requestValidation(client: Socket, payload: S.SocketRequestValidationType) {
    try {
      const {ok, body, errObj} = await this.jwtService.requestValidationSocket(payload.jwtFromClient)

      if (ok) {
        const {jwtFromServer} = body
        const payload: S.SocketResponseValidationType = {jwtFromServer}
        return {client, payload}
      } // ::
      else {
        const jwtFromServer = ''
        const payload: S.SocketResponseValidationType = {jwtFromServer}

        console.log(`\n유저 소켓 토큰 인증중 에러 발생: ${errObj}`)
        Object.keys(errObj).forEach(key => {
          console.log(`   ${key}: ${errObj[key]}`)
        })

        return {client, payload}
      }
      // ::
    } catch (errObj) {
      // ::
      const jwtFromServer = ''
      const payload: S.SocketResponseValidationType = {jwtFromServer}

      console.log(`\n유저 소켓 토큰 인증중 치명적인 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })

      return {client, payload}
    }
  }

  // AREA2: User Service Area

  @SubscribeMessage('user connect')
  @UseGuards(CheckSocketJwtGuard)
  userConnect(client: Socket, payload: S.UserConnectType) {
    try {
      this.userService.userConnect(this.server, client, payload)
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] userConnect 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  // AREA3: Chat Service Area

  // AREA4: Export Function Area

  getServer() {
    return this.server
  }

  @SendSocketRoomMessage('new alarm')
  sendUserAlarm(alarm: T.AlarmType) {
    const {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, senderUserName, senderUserOId, userOId} = alarm

    const server = this.server
    const roomId = userOId
    const payload: S.NewAlarmType = {
      alarmOId,
      alarmStatus,
      alarmType,
      content,
      createdAt,
      fileOId,
      senderUserName,
      senderUserOId,
      userOId
    }
    return {server, roomId, payload}
  }
}
