export type CreateAlarmDTO = {
  alarmType: number
  content: string
  createdAt: Date
  fileOId: string
  senderUserName: string
  senderUserOId: string
  userOId: string
}

export type CreateCommentDTO = {
  content: string
  fileOId: string
  userName: string
  userOId: string
}

export type CreateDirDTO = {
  dirName: string
  parentDirOId: string
}

export type CreateFileDTO = {
  dirOId: string
  fileName: string
  userName: string
  userOId: string
}

export type CreateReplyDTO = {
  commentOId: string
  content: string
  targetUserOId: string
  targetUserName: string
  userName: string
  userOId: string
}

export type SignUpDTO = {
  userId: string
  userMail: string
  userName: string
  password: string
  picture: string
  signUpType: 'common' | 'google'
}
