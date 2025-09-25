// AREA1: 클라이언트가 전송할때 쓰는 타입

export type ChatMessageType = {
  chatRoomOId: string
  content: string
}

export type ChatRoomConnectType = {
  chatRoomOId: string
  jwtFromClient: string
  userOId: string
}

export type ChatRoomDisconnectType = {
  chatRoomOId: string
  userOId: string
}

export type SocketRequestValidationType = {
  jwtFromClient: string
}

export type UserConnectType = {
  userOId: string
  jwtFromClient: string
}

// AREA2: 서버가 전송할때 쓰는 타입

export type ChatRoomOpenedType = {
  chatRoomOId: string
}

export type NewAlarmType = {
  /**
   * shareTypes 의 AlarmType 과 동일해야 한다.
   */
  alarmOId: string
  alarmStatus: number
  alarmType: number
  content: string
  createdAt: Date
  fileOId: string
  senderUserName: string
  senderUserOId: string
  userOId: string
}

export type NewChatType = {
  // 서버가 전송하는 채팅 데이터이다.
  // ChatType 하고 동일하다.
  chatIdx: number
  chatRoomOId: string
  content: string
  createdAt: Date
  userOId: string // 보낸 유저
  userName: string // 보낸 유저
}

export type NewChatRoomCreatedType = {
  chatRoomOId: string
  chatRoomName: string // 보통은 targetUserName 이 들어간다.
  targetUserId: string
  targetUserMail: string
  targetUserName: string
  targetUserOId: string
  unreadMessageCount: number

  lastChatDate: Date
}

export type RefreshChatRoomType = {
  chatRoomOId: string
  unreadMessageCount: number
}

export type SocketResponseValidationType = {
  jwtFromServer: string
}

export type UserAlarmRemovedType = {
  alarmOId: string
}
