// AREA1: 베이스 타입
export type ContentType = {
  type: 'string' | 'image'
  value: string
}
/**
 * Lefter 같은곳에서 OId 랑 name 만 사용하기 위해 쓰는 타입
 */
export type FileRowType = {
  fileOId: string
  name: string
  parentDirOId: string
}
export type ReplyType = {
  commentOId: string
  date: Date
  dateString: string
  content: string // 대댓글 내용
  // replyOId: string // 어차피 comment 에 배열로 있기때문에 필요없다.
  targetUserOId: string
  targetUserName: string
  userOId: string
  userName: string
}

// AREA2: 일반 타입
export type AlarmType = {
  alarmOId: string
  content: string
  date: Date
  dateString: string
  isReceived: boolean
  sendUserOId: string
  sendUserName: string
  targetUserOId: string // 댓글이면 fileUserOId, 대댓글이면 commentUserOId
  targetObjectId: string // reading 이면 fileOId 가 들어간다.
  type: 'readingComment' | 'readingReply'
}
export type CommentType = {
  commentOId: string
  content: string // 댓글 내용
  date: Date
  dateString: string
  fileOId: string
  replyArr: ReplyType[]
  userOId: string
  userName: string
}
export type DirectoryType = {
  dirName: string
  dirOId: string
  fileOIdsArr: string[]
  // isOpen?: boolean // 클라이언트에서 폴더 열렸는지 확인용 은 클라에서 따로 관리하자
  parentDirOId: string
  subDirOIdsArr: string[]
}
/**
 * 특정 디렉토리만 조작할때 쓰는 타입
 */
export type ExtraDirObjectType = {
  dirOIdsArr: string[]
  directories: {[dirOId: string]: DirectoryType}
}
/**
 * 특정 FileRow만 조작할때 쓰는 타입
 */
export type ExtraFileRowObjectType = {
  fileOIdsArr: string[]
  fileRows: {[fileOId: string]: FileRowType}
}
export type FileType = {
  contentsArr: ContentType[]
  fileOId: string
  name: string
  parentDirOId: string
}
export type UserType = {
  picture?: string
  signUpType?: 'local' | 'google'
  userAuth: number
  userId: string
  userName: string
  userOId: string
}
