import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'
import {ClientPortService, SocketPortService} from 'src/modules/database/ports'
import {GKDLockService} from 'src/modules/gkdLock/gkdLock.service'
import {SocketInfoService} from './socket.info.service'

import * as T from '@common/types'
import * as S from '@common/types/socketTypes'

@Injectable()
export class SocketChatService {
  constructor(
    private readonly infoService: SocketInfoService,
    private readonly portService: SocketPortService
  ) {}

  // AREA1: Socket
  async connectUserChatSocket(client: Socket, payload: S.ChatSocketConnectType) {
    const {chatRoomOId, userOId} = payload
    await this.infoService.joinSocketToChatRoom(client, userOId, chatRoomOId)
  }
  async disconnectSocket(client: Socket) {
    this.infoService.leaveSocketFromChatRoom(client)
  }

  // AREA2: Service Area
  async chatMessage(server: Server, client: Socket, payload: S.ChatMessagePayloadType) {
    /**
     * - 클라이언트가 채팅 메시지를 보냈을때 실행하는 함수이다.
     *
     * - 채팅방 mutex lock 은 여기서 걸지 않는다.
     *   - port 에서 채팅방 락을 걸어야 한다.
     *   - clientPort 에서 채팅방 읽어올때 mutex lock 을 걸어야 하기 때문이다.
     *
     * 1. 채팅을 DB 에 저장한다
     *   - chatRoomOId 에 mutex lock 이 걸린다.
     *   - 저장한 채팅, readyLock, 채팅방 참여자 배열을 리턴한다.
     *
     * 2. chatRoomOId 에 있는 chatSocket 에 채팅 메시지를 보낸다.
     *   - chatSocket 이 연결되지 않은 유저들의 OId 는 따로 모은다.
     *
     * 3. 따로 배열에 넣은 유저들의 해당 채팅방의 안 읽은 메시지 개수를 1 늘린다.
     *   - 메인소켓은 연결되어있는 경우
     *     - 해당 유저의 이 채팅방에서의 안 읽은 메시지 개수를 1 늘리는 메시지를 보낸다.
     */

    let readyLock = ''

    try {
      // 1. 채팅을 DB 에 저장한다
      const {chat, readyLock: _readyLock, userOIdsArr} = await this.portService.sendChatMessage(payload)
      const {chatRoomOId} = chat
      readyLock = _readyLock

      // 2. chatRoomOId 에 있는 chatSocket 에 채팅 메시지를 보낸다.
      const {chatSocketsArr} = this.infoService.getChatRoomSockets(server, chatRoomOId)

      let remainUserOIdsArr = [...userOIdsArr] // 채팅방 연결된 유저는 여기서 뺀다.

      chatSocketsArr.map(chatSocket => {
        chatSocket.emit('chatMessage', chat)
        const userOId = this.infoService.readSocketsUserOId(chatSocket)

        // 채팅방 연결된 유저는 여기서 뺀다.
        remainUserOIdsArr = remainUserOIdsArr.filter(uOId => uOId !== userOId)
      })

      // 3. 채팅소켓 연결 안 된 유저들의 해당 채팅방의 안 읽은 메시지 개수를 1 늘린다.
      await Promise.all(
        remainUserOIdsArr.map(async userOId => {
          const {isActiveChanged, unreadCount} = await this.portService.increaseChatRoomUnreadCnt(userOId, chatRoomOId)
          const {mainSocketsArr} = this.infoService.getMainSockets(server, userOId)

          const payload: S.SetUnreadChatPayloadType = {
            chatRoomOId,
            isActiveChanged,
            unreadCount
          }
          mainSocketsArr.forEach(mainSocket => {
            mainSocket.emit('setUnreadChatLen', payload)
          })
        })
      )
      // ::
    } catch (errObj) {
      // ::
      if (errObj.readyLock) {
        readyLock = errObj.readyLock
      }
      throw errObj
      // ::
    } finally {
      // ::
      if (readyLock) {
        // readyLock 이 빈 문자열일 수 있다.
        this.portService.releaseReadyLock(readyLock)
      }
      // ::
    }
  }
}
