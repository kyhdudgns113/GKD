import type {Dispatch, SetStateAction} from 'react'

export type AuthBodyType = {
  jwtFromServer: string
  picture?: string
  userAuth: number
  userId: string
  userName: string
  userOId: string
}
export type CallbackType = () => void
export type Setter<T> = Dispatch<SetStateAction<T>>
