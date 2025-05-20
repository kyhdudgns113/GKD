import {PokerUserType} from './shareTypes'

export type AddPokerUserDataType = {
  name: string
}
export type SavePokerUserArrDataType = {
  pokerUsersArr: PokerUserType[]
}
export type SaveSettingDataType = {
  bigBlind: number
  rebuy: number
  smallBlind: number
}
