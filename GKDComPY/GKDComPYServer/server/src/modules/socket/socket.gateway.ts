import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import * as S from 'src/common/types/socketTypes'
import {SocketChatService} from './socket.chat'

@WebSocketGateway({cors: true})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: SocketChatService) {}

  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    // console.log(`socket ${client.id} connected`)
  }

  handleDisconnect(client: Socket) {
    this.chatService.disconnectSocket(client)
  }

  @SubscribeMessage('chat connect')
  async chatConnect(client: Socket, payload: S.ChatConnectType) {
    await this.chatService.connectUserChatSocket(client, payload)
  }
  @SubscribeMessage('club chat')
  async clubChat(client: Socket, payload: S.ClubChatType) {
    await this.chatService.clubChat(this.server, client, payload)
  }
  @SubscribeMessage('main connect')
  async mainConnect(client: Socket, payload: S.MainConnectType) {
    await this.chatService.connectUserMainSocket(client, payload)
  }
}
