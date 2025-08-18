// AREA1: 베이스 타입
export type FileRowType = {
  /**
   * Lefter 같은곳에서 OId 랑 name 만 사용하기 위해 쓰는 타입
   */
  dirOId: string
  fileName: string
  fileOId: string
  fileStatus: number
}
export type ReplyType = {
  commentOId: string // 대댓글이 달려있는 댓글의 OId
  content: string // 대댓글 내용
  date: Date // 이거랑 replyOId 로 정렬한다.
  replyOId: string
  targetUserOId: string
  targetUserName: string
  userId: string
  userOId: string
  userName: string
}

// AREA2: 일반 타입
export type AlarmType = {
  alarmOId: string
  content: string
  date: Date
  isReceived: boolean // 알람 아이콘 클릭 안했으면 false, 클릭했으면 true
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

  // 채팅 할 때 마다 DB 에서 확인하는게 보안상 낫다.
  // + 개인 채팅만 구현하자. 단체 채팅이 필요가 없다
  // userOIdsArr: string[] // 채팅방에 속한 유저들의 OId 배열. 본인도 포함이다.

  // 이건 서버에서 데이터 전달용으로 쓴다.
  // 클라이언트는 ChatRoomRowType 에서 사용한다.
  unreadCount?: number
}
export type ChatRoomRowType = {
  chatRoomOId: string
  // 개인 채팅만 사용하기로 하여 사용하지 않는다.
  // chatRoomName: string // 보통은 targetUserName 이 들어간다.
  targetUserId: string
  targetUserName: string
  targetUserOId: string
  unreadCount: number

  lastChatDate?: Date // 서버에서 정렬용으로 쓴다
}
export type CommentType = {
  commentOId: string
  content: string // 댓글 내용
  date: Date // 이거랑 commentOId 로 정렬한다.
  fileOId: string
  // reply 의 date 값과 replyOId 로 정렬하여 전송받는다.
  // replyArr: ReplyType[]
  userOId: string
  userName: string
}
export type DirectoryType = {
  dirName: string
  dirOId: string
  fileOIdsArr: string[] // DB 에 따로 저장은 안하되, 서버에서 전송은 해준다.
  // isOpen?: boolean // 클라이언트에서 폴더 열렸는지 확인용 은 클라에서 따로 관리하자
  parentDirOId: string
  subDirOIdsArr: string[] // DB 에 따로 저장은 안하되, 서버에서 전송은 해준다.
}
export type ExtraDirObjectType = {
  /**
   * 특정 디렉토리만 조작할때 쓰는 타입
   */
  dirOIdsArr: string[]
  directories: {[dirOId: string]: DirectoryType}
}
export type ExtraFileRowObjectType = {
  /**
   * 특정 FileRow만 조작할때 쓰는 타입
   */
  fileOIdsArr: string[]
  fileRows: {[fileOId: string]: FileRowType}
}
export type FileType = {
  content: string
  dirOId: string
  fileIdx: number
  fileOId: string
  fileName: string
  fileStatus: number
  userName: string
  userOId: string
}
export type UserType = {
  picture?: string
  signUpType?: 'common' | 'google'
  userAuth: number
  userId: string
  userName: string
  userOId: string
}
