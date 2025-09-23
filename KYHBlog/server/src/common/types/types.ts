/**
 * Client 와 공유하지 않는다.
 */

export type ChatRoomTableType = {
  chatRoomOId: string
  userOId: string
  targetUserOId: string
}
export type ErrorObjType = {
  gkd: Object
  gkdErrCode: string
  gkdErrMsg: string
  gkdStatus: Object
  statusCode: number
  where: string
}
export type GoogleUserType = {
  userId: string
  userName: string
  picture: string
}
export type JwtPayloadType = {
  signUpType: 'common' | 'google'
  userId: string
  userName: string
  userOId: string
}
export type LogType = {
  date: Date
  errObj: any
  gkd: any
  gkdErr: string
  gkdLog: string
  gkdStatus: any
  logOId: string
  userId: string
  userName: string
  userOId: string
  where: string
}
export type RefreshChatRoomsType = {
  [userOId: string]: {
    chatRoomOId: string
    unreadMessageCount: number
  }
}
export type ServiceReturnType = {
  ok: boolean
  body: any
  errObj: any
  jwtFromServer?: string
}
export type SignUpType = 'common' | 'google'
