export type PokerSettingType = {
  smallBlind: number
  bigBlind: number
  rebuy: number
}
export type PokerUserType = {
  bankroll: number
  chips?: number
  createdAt: Date
  debts: number
  name: string
  nowBet?: number
  userStatus?: number
  pUOId: string
  resultGain?: number
  totalBet?: number
}
