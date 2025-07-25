/**
 * Client 와 공유하지 않는다.
 */

export type ChatRoomTableType = {
  chatRoomOId: string
  userOId: string
  targetUserOId: string
}
export type GoogleUserType = {
  userId: string
  userName: string
  picture: string
}
export type JwtPayloadType = {
  signUpType: 'local' | 'google'
  userId: string
  userName: string
  userOId: string
}
export type LogType = {
  date: Date
  dateValue: number
  errObj: any
  gkd: any
  gkdErr: string
  gkdLog: string
  gkdStatus: any
  logOId: string
  userOId: string
  userId: string
  where: string
}
export type ServiceReturnType = {
  ok: boolean
  body: any
  errObj: any
  jwtFromServer?: string
}
export type SignUpType = 'local' | 'google'
