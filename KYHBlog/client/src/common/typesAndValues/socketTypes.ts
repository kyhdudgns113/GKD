// AREA1: 연결용 타입
export type MainSocketConnectType = {
  userOId: string
}

export type ChatSocketConnectType = {
  chatRoomOId: string
  userOId: string
}

// AREA2: 클라이언트가 전송할때 쓰는 타입
export type ChatMessagePayloadType = {
  chatRoomOId: string
  content: string
  userOId: string
  userName: string
}

// AREA3: 서버가 전송할때 쓰는 타입
export type SetUnreadChatPayloadType = {
  chatRoomOId: string
  isActiveChanged: boolean
  unreadCount: number
}
