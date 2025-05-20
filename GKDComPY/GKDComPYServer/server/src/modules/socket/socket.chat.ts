import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'
import {JwtPayloadType} from 'src/common/types'
import {ChatConnectType, ClubChatType, MainConnectType} from 'src/common/types/socketTypes'
import {ClientPortService} from 'src/modules/database/ports/clientPort/clientPort.service'
import {SocketInfoService} from './socket.info'
import {GKDLockService} from '../gkdLock/gkdLock.service'

@Injectable()
export class SocketChatService {
  constructor(
    private readonly clientService: ClientPortService,
    private readonly infoService: SocketInfoService,
    private readonly lockService: GKDLockService
  ) {}

  // AREA2: Socket
  async clubChat(server: Server, client: Socket, payload: ClubChatType) {
    const {clubOId, chatRoomOId, id} = payload
    const readyLock = await this.lockService.readyLock(chatRoomOId)

    try {
      // 현재 채팅방과 연결된 uOIdsArr 구하기
      const socketIds = Array.from(server.sockets.adapter.rooms.get(chatRoomOId))
      const {uOIdsArr} = this.infoService.getSocketsUOIdsArr(socketIds)

      // 채팅방 DB 갱신
      // 유저별 안 읽은 메시지 갱신
      const {chat, unreadUOIdsArr} = await this.clientService.clubChat(uOIdsArr, payload)

      // 채팅방에 연결된 유저들에게 채팅 전송
      server.to(chatRoomOId).emit('club chat', chat)

      // 메인소켓은 연결된 유저들에게 안 읽은 메시지 소켓전송
      for (let uOId of unreadUOIdsArr) {
        server.to(uOId).emit('unread', clubOId)
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(`${id}가 ${clubOId}에서 채팅할때 오류발생 `)
      console.log(errObj)
      // BLANK LINE COMMENT:
    } finally {
      // BLANK LINE COMMENT:
      await this.lockService.releaseLock(readyLock)
    }
  }
  async connectUserChatSocket(client: Socket, payload: ChatConnectType) {
    const {uOId, chatRoomOId} = payload
    await client.join(chatRoomOId)
    this.infoService.joinSocketToUser(client, uOId)
  }
  async connectUserMainSocket(client: Socket, payload: MainConnectType) {
    const {uOId} = payload
    await client.join(uOId)
    this.infoService.joinSocketToUser(client, uOId)
  }
  async disconnectSocket(client: Socket) {
    this.infoService.leaveSocketFromUser(client)
  }
}
