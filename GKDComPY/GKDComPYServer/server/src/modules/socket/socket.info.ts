import {Injectable} from '@nestjs/common'
import {Socket} from 'socket.io'

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
  private socketsUOId: Record<string, string> = {}

  getSocketsUOIdsArr(socketIds: string[]) {
    const uOIdsSet = new Set(socketIds.map(socketId => this.socketsUOId[socketId]))
    const uOIdsArr = Array.from(uOIdsSet)
    return {uOIdsArr}
  }
  joinSocketToUser(client: Socket, uOId: string) {
    this.socketsUOId[client.id] = uOId
  }
  leaveSocketFromUser(client: Socket) {
    delete this.socketsUOId[client.id]
  }
  readSocketsUOId(client: Socket) {
    return this.socketsUOId[client.id]
  }
}
