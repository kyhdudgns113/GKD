import {Dispatch, SetStateAction} from 'react'
import {PokerUserType} from './shareTypes'

export type Setter<T> = Dispatch<SetStateAction<T>>

export type CalcScoreType = {
  user: PokerUserType
  userIdx: number
  seatIdx: number
  score: number
  status: number[]
  isMade: boolean
}
