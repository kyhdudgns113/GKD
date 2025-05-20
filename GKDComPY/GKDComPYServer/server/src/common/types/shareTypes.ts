/**
 * 여기는 Admin, Server, Service 가 모두 공유한다.
 */
export type CardInfoType = {
  name: string | null
  posIdx: number
  skillIdxs: number[]
  skillLevels: number[]
}
export type CommunityInfoType = {
  commOId: string
  name: string
  users: {[uOId: string]: number}
  clubOIdsArr: string[]
  banClubOId: string
  maxUsers: number
  maxClubs: number
}
export type CommsRowType = {
  commOId: string
  name: string
}
// AREA1:
/**
 * 멤버 관리 페이지에서 쓸 타입이다.
 * 덱이 필요가 없다.
 */
export type EMemberType = {
  batterPower: number | null
  clubOId: string
  colIdx: number
  commOId: string
  memberComment: string
  memOId: string
  name: string
  position: number
  pitcherPower: number | null
}

// AREA2: ChatRoom Area
export type ChatType = {
  chatIdx: number
  date: Date
  uOId: string
  id: string
  content: string
}
export type ChatRoomType = {
  chatRoomOId: string
  clubOId: string | null
  length: number
  chatsArr: ChatType[]
}

// AREA3: Document Area
export type DocChangeType = {
  uOId: string
  delStart: number | null
  delEnd: number | null
  newContents: string[] | null
}
export type DocContentRowType = string | null

// AREA4: Club Info Area
export type RecordBlockType = {
  result: number
  useClientLineUp: boolean
}
export type DailyRecordType = {
  clubOId: string
  memOId: string | null
  name: string
  date: number
  condError: number
  comment: string
  recordsArr: RecordBlockType[]
}

export type RecordMemberInfoType = {
  memOId: string | null
  name: string
  position: number
  batterPower: number | null
  pitcherPower: number | null
}
export type RecordRowInfoType = {
  clubOId: string
  membersInfo: RecordMemberInfoType[]
}
export type RecordDateInfoType = {
  clubOId: string
  date: number
  enemyName: string
  pitchOrder: number | null
  order: string
  result: string
  tropy: number | null
  points: number | null
  comments: string
}
export type RecordColInfoType = {
  clubOId: string
  dateInfo: RecordDateInfoType[]
}
export type WeeklyRecordType = {
  weekOId: string
  clubOId: string
  start: number
  end: number
  title: string
  comment: string
  rowInfo: RecordRowInfoType
  colInfo: RecordColInfoType
}
export type WeekRowsType = {
  weekOId: string
  start: number
  end: number
  title: string
}

export type ClubInfoType = {
  commOId: string
  clubOId: string
  name: string
  weekRowsArr: WeekRowsType[]
  chatRoomOId: string
  docOId: string
}

export type MemberInfoType = {
  batterPower: number | null
  clubOId: string | null
  commOId: string
  deck: CardInfoType[]
  lastRecorded: number | null
  memberComment: string
  memOId: string
  name: string
  position: number
  pitcherPower: number | null
}

export type UserInfoType = {
  uOId: string
  id: string
  commOId: string
  unreadMessages: {[chatRoomOId: string]: number}
}
export type UserInfoAuthType = {
  // & 연산자 쓰면 전체 구성이 주석으로 안나와서 불편해진다.
  uOId: string
  id: string
  commOId: string
  // 생각해보니 관리자계정은 이거 있어야 한다. 자세한건 server 의 entity 에서 확인
  authVal: number
  unreadMessages: {[chatRoomOId: string]: number}
}

// AREA5: Poker Area
export type PokerSettingType = {
  bigBlind: number
  rebuy: number
  smallBlind: number
}
export type PokerUserType = {
  bankroll: number
  chips?: number
  createdAt: Date
  debts: number
  name: string
  nowBet?: number
  pUOId: string
  totalBet?: number
}

// AREA1: Logs Area
export type LogType = {
  date: Date
  dateValue: number
  errObj: any
  gkd: any
  gkdErr: string
  gkdLog: string
  gkdStatus: any
  logOId: string
  uOId: string
  userId: string
  where: string
}
