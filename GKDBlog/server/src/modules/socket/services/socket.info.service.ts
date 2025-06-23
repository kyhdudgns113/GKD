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
   *
   * 생각해보니 굳이 채팅 소켓만 이걸 해야할 필요가 없다.
   */
  private socketsUserOId: Record<string, string> = {}

  // AREA1: Sockets Area
  getSocketsUserOIdsArr(socketIds: string[]) {
    const userOIdsSet = new Set(socketIds.map(socketId => this.socketsUserOId[socketId]))
    const userOIdsArr = Array.from(userOIdsSet)
    return {userOIdsArr}
  }
  async joinSocketToUser(client: Socket, userOId: string) {
    this.socketsUserOId[client.id] = userOId
    await client.join(userOId)
  }
  leaveSocketFromUser(client: Socket) {
    delete this.socketsUserOId[client.id]
  }
  readSocketsUserOId(client: Socket) {
    return this.socketsUserOId[client.id]
  }

  // AREA2: Users Area

  /**
   * userOId 의 소켓들을 배열 형태로 리턴한다.
   */
  getUserSockets(server: Server, userOId: string) {
    const sockets = server.sockets.adapter.rooms.get(userOId)
    return sockets ? Array.from(sockets) : []
  }
}
