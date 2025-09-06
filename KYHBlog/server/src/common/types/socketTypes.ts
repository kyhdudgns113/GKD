// AREA1: 클라이언트가 전송할때 쓰는 타입
export type SocketRequestValidationType = {
  jwtFromClient: string
}

export type UserConnectType = {
  userOId: string
  jwtFromClient: string
}

// AREA2: 서버가 전송할때 쓰는 타입

export type NewAlarmType = {
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

export type SocketResponseValidationType = {
  jwtFromServer: string
}
