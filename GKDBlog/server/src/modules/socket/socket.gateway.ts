import {Server, Socket} from 'socket.io'
import {SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets'

import * as T from '@common/types'
import * as S from '@common/types/socketTypes'
import * as SVC from './services'

@WebSocketGateway({cors: true})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly mainService: SVC.SocketMainService,
    private readonly infoService: SVC.SocketInfoService
  ) {}

  @WebSocketServer()
  server: Server

  // AREA1: Connection

  handleConnection(client: Socket) {
    // ::
  }
  handleDisconnect(client: Socket) {
    this.mainService.disconnectSocket(client)
  }

  // AREA2: Message

  /**
   * 유의사항
   * - 서버만 재시작된 상태에서는 클라이언트가 이 메시지를 보내지 않는다.
   * - 따라서 소켓 room 정보가 저장되지 않는다.
   */
  @SubscribeMessage('mainSocketConnect')
  async mainSocketConnect(client: Socket, payload: S.MainSocketConnectType) {
    await this.mainService.connectUserMainSocket(client, payload)
  }

  @SubscribeMessage('mainTest')
  async mainSocketTest(client: Socket, payload: any) {
    const userOId = payload
    const sockets = this.infoService.getUserSockets(this.server, userOId)
    console.log(`RESULT IS ${sockets.length}`)
    sockets.forEach(socketId => {
      console.log(`  socketId: ${socketId}`)
    })
  }

  // AREA3: Exported Service

  async alarmReadingComment(fileUserOId: string, comment: T.CommentType) {
    /**
     * Reading 게시글에서 댓글이 달렸다고 알람을 보내는 함수
     * - client.reading/addComment 에서 호출한다
     * - Reading 게시글은 강영훈만 쓸 수 있으므로 userOId 를 받지 않는다.
     */
    await this.mainService.alarmReadingComment(this.server, fileUserOId, comment)
  }

  async alarmReadingReply(targetUserOId: string, reply: T.ReplyType) {
    /**
     * Reading 게시글에서 대댓글이 달렸다고 알람을 보내는 함수
     * - client.reading/addReply 에서 호출한다
     */
    await this.mainService.alarmReadingReply(this.server, targetUserOId, reply)
  }

  async refreshAlarmArr(userOId: string, receivedAlarmArr: T.AlarmType[]) {
    /**
     * 수신 확인 안 되었던 알람들을 수신 확인된 상태로 바꾼다.
     * - 이후 수신 안 된 알람 갯수를 갱신해서 보내준다.
     */
    await this.mainService.refreshAlarmArr(this.server, userOId, receivedAlarmArr)
  }
}
