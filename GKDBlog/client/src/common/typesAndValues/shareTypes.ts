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
  isIntroPost: boolean
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
export type ChatType = {
  chatIndex: number
  chatOId: string
  chatRoomOId: string
  content: string
  date: Date
  dateString: string
  userOId: string // 보낸 유저
  userName: string // 보낸 유저
}
export type ChatRoomType = {
  chatRoomOId: string
  targetUserId: string // 실제 chatRoomDB 에 이 값이 있지는 않다.
  targetUserOId: string
  targetUserName: string

  // 이건 클라이언트에선 거의 안쓴다.
  lastChatDate: Date
  userOIdsArr: string[] // 채팅방에 속한 유저들의 OId 배열. 본인도 포함이다.

  // 이건 서버에서 데이터 전달용으로 쓴다.
  // 클라이언트는 ChatRoomRowType 에서 사용한다.
  unreadCount?: number
}
export type ChatRoomRowType = {
  chatRoomOId: string
  chatRoomName: string // 보통은 targetUserName 이 들어간다.
  targetUserId: string
  targetUserName: string
  unreadCount: number

  lastChatDate?: Date // 서버에서 정렬용으로 쓴다
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
  isIntroPost: boolean
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
