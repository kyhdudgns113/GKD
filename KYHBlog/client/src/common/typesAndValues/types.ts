import type {Dispatch, SetStateAction} from 'react'
import type {DefaultEventsMap} from 'socket.io'
import type {Socket} from 'socket.io-client'

export type AuthBodyType = {
  jwtFromServer: string
  picture?: string
  userAuth: number
  userId: string
  userMail: string
  userName: string
  userOId: string
}
export type CallbackType = () => void
export type LockType = {isLock: boolean; cnt: number}
export type Setter<T> = Dispatch<SetStateAction<T>>
export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null
