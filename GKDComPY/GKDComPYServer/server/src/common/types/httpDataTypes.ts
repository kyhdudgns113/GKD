/**
 * Admin, Service, Server 가 모두 같은 내용을 공유해야 한다.
 */

import {EMemberType, PokerUserType} from './shareTypes'

/**
 * 현재는 SignUpDataType 이랑 같다 \
 * 하지만 나중에 어떻게 변경될지 모르니 따로 작성한다
 */
export type AddClubDataType = {
  commOId: string
  name: string
}
export type AddCommDataType = {
  name: string
}
export type AddMemberDataType = {
  name: string
  commOId: string
  clubOId: string | null
  batterPower: number | null
  pitcherPower: number | null
}
export type AddNextWeekDataType = {
  clubOId: string
}
export type AddPrevWeekDataType = {
  clubOId: string
}
export type AddRowMemberDataType = {
  weekOId: string
  position: number
  name: string
  batterPower: number
  pitcherPower: number
}
export type AddUserDataType = {
  id: string
  password: string
  commOId: string
}
export type ChangeCommNameDataType = {
  commOId: string
  name: string
}
export type ChangeMemClubDataType = {
  memOId: string
  clubOId: string
}
export type DeleteRowMemDataType = {
  // DELETE 메소드로 했더니 한글 인코딩 오류 ㅠㅠ
  weekOId: string
  name: string
}
export type DeleteWeekRowDataType = {
  clubOId: string
  weekOId: string
}
export type LogInDataType = {
  id: string
  password: string
}
export type ModifySelfInfoDataType = {
  uOId: string
  id: string
  prevPassword: string
  newPassword: string
}
export type SetCardInfoDataType = {
  memOId: string
  posIdx: number
  name: string
  skillIdxs: number[]
  skillLevels: number[]
}
export type SetCommAuthDataType = {
  uOId: string
  commOId: string
  authVal: number | null
}
export type SetCommMaxClubsDataType = {
  commOId: string
  maxClubs: number
}
export type SetCommMaxUsersDataType = {
  commOId: string
  maxUsers: number
}
export type SetCommentDataType = {
  weekOId: string
  dayIdx: number
  comments: string
}
export type SetDailyRecordType = {
  clubOId: string
  start: number
  end: number
  date: number
  name: string
  condError: number
  results: number[]
  comment: string
  memOId: string | null
}
export type SetDocumentDataType = {
  clubOId: string
  contents: string[]
}
export type SetEMemMatrixDataType = {
  commOId: string
  eMembersMatrix: EMemberType[][]
}
export type SetMemberCommentDataType = {
  clubOId: string
  memOId: string
  memberComment: string
}
export type SetMemberInfoDataType = {
  commOId: string
  memOId: string
  name: string
  batterPower: number | null
  pitcherPower: number | null
  clubOId: string | null
  comment: string
}
export type SetMemberPosDataType = {
  memOId: string
  position: number
}
export type SetMemberPowerDataType = {
  memOId: string
  name: string
  batterPower: number | null
  pitcherPower: number | null
}
export type SetRowMemberDataType = {
  batterPower: number
  memOId: string | null
  name: string
  pitcherPower: number
  position: number
  prevName: string
  weekOId: string
}
export type SetTHeadDataType = {
  clubOId: string
  weekOId: string
  dateIdx: number
  enemyName: string
  pitchOrder: number | null
  order: string
}
export type SetUserInfoDataType = {
  uOId: string
  id: string
  password: string
  authVal: number | null
}
export type SetWeeklyCommentDataType = {
  weekOId: string
  comment: string
}
export type SignUpDataType = {
  id: string
  password: string
}

// AREA2: Poker Area
export type AddPokerUserDataType = {
  name: string
}
export type SavePokerUsersArrDataType = {
  pokerUsersArr: PokerUserType[]
}
export type SaveSettingDataType = {
  bigBlind: number
  rebuy: number
  smallBlind: number
}
