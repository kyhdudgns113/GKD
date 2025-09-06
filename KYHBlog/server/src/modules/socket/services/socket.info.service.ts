import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'

@Injectable()
export class SocketInfoService {
  constructor() {}
  /**
   * 유저가 보유한 메인소켓 리스트는 저장할 필요가 없다.
   * room 으로 관리하면 된다.
   */

  /**
   * socketsUOId[sockId] = uOId
   */
  private socketsUserOId: Record<string, string> = {}

  // AREA1: Sockets Area
  getSocketsUserOIdsArr(socketIds: string[]) {
    const userOIdsSet = new Set(socketIds.map(socketId => this.socketsUserOId[socketId]))
    const userOIdsArr = Array.from(userOIdsSet)
    return {userOIdsArr}
  }

  async joinSocketToChatRoom(client: Socket, userOId: string, chatRoomOId: string) {
    this.socketsUserOId[client.id] = userOId
    await client.join(chatRoomOId)
  }
  async joinSocketToUser(client: Socket, userOId: string) {
    this.socketsUserOId[client.id] = userOId
    await client.join(userOId)
  }

  leaveSocketFromChatRoom(client: Socket) {
    if (this.socketsUserOId[client.id]) {
      delete this.socketsUserOId[client.id]
    }
  }
  leaveSocketFromUser(client: Socket) {
    if (this.socketsUserOId[client.id]) {
      delete this.socketsUserOId[client.id]
    }
  }

  readSocketsUserOId(client: Socket) {
    return this.socketsUserOId[client.id]
  }

  // AREA2: Others Area
  /**
   * chatRoomOId 의 소켓들의 정보를 리턴한다.
   */
  getChatRoomSockets(server: Server, chatRoomOId: string) {
    const sockets = server.sockets.adapter.rooms.get(chatRoomOId)
    if (!sockets) {
      return {chatSocketsArr: []}
    }
    const chatSocketsArr = Array.from(sockets).map(socketId => server.sockets.sockets.get(socketId))
    return {chatSocketsArr}
  }
  /**
   * userOId 의 소켓들을 배열 형태로 리턴한다.
   */
  getMainSockets(server: Server, userOId: string) {
    const sockets = server.sockets.adapter.rooms.get(userOId)
    if (!sockets) {
      return {mainSocketsArr: []}
    }
    const mainSocketsArr = Array.from(sockets).map(socketId => server.sockets.sockets.get(socketId))
    return {mainSocketsArr}
  }
}
