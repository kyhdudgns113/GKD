/**
 * Server 랑은 공유하지 않는다.
 * Service 랑은 공유한다.
 */
import {Dispatch, SetStateAction} from 'react'

export type CallbackType = () => void
export type Setter<T> = Dispatch<SetStateAction<T>>

export type AuthBodyType = {
  id: string
  jwtFromServer: string
  uOId: string
}
export type PatchNoteType = {
  date: number
  comments: string[]
}
