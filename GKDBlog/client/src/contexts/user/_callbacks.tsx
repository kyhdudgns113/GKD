import {createContext, useCallback, useContext} from 'react'
import {useAuthStatesContext} from '@contexts/auth/__states'
import {useUserStatesContext} from './__states'
import {delWithJwt, getWithJwt, putWithJwt} from '@server'

import {alertErrors} from '@utils/alertErrors'
import {writeJwtFromServer} from '@utils/writeJwtFromServer'

import type {FC, PropsWithChildren} from 'react'
import type {AlarmType, ChatRoomType, ChatType} from '@shareType'
import type {Setter} from '@type'
import {useModalStatesContext} from '@contexts/modal/__states'

// prettier-ignore
type ContextType = {
  openUserChatRoom: (targetUserOId: string) => void,  

  getChatArr: (chatRoomOId: string, setChatArr: Setter<ChatType[]>, setIsDBLoaded: Setter<boolean> | null, setGoToBot: Setter<boolean> | null,  firstIndex?: number) => void,
  getChatRoom: (chatRoomOId: string, setChatRoom: Setter<ChatRoomType>) => void,
  getChatRoomRow: (chatRoomOId: string) => void,
  getChatRoomRowArr: (userOId: string) => void,
  getNewAlarmArrLen: () => void
  refreshAlarmArr: (setAlarmArr: Setter<AlarmType[]>, setIsLoading: Setter<boolean>) => void

  deleteAlarm: (alarm: AlarmType) => void
}
// prettier-ignore
export const UserCallbacksContext = createContext<ContextType>({  

  openUserChatRoom: () => {},

  getChatArr: () => {},
  getChatRoom: () => {},
  getChatRoomRow: () => {},
  getChatRoomRowArr: () => {},
  getNewAlarmArrLen: () => {},  
  refreshAlarmArr: () => {},
  
  deleteAlarm: () => {},
})

export const useUserCallbacksContext = () => useContext(UserCallbacksContext)

export const UserCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId} = useAuthStatesContext()
  const {setOpenChatRoomOId} = useModalStatesContext()
  const {setChatRoomRowArr, setNewAlarmArrLen} = useUserStatesContext()

  // POST AREA:

  // PUT AREA:
  const openUserChatRoom = useCallback(
    (targetUserOId: string) => {
      /**
       * 설명
       *  - 댓글이나 대댓글의 유저를 클릭하는 등의 행위로 실행된다
       *  - targetUserOId 유저와의 채팅방을 읽어오거나 생성하고 연다
       *
       * 성공시 서버가 전달해야 할 것
       *  - 현재 유저의 리스트에 올려둔 채팅방 행의 배열
       *    - date 가 최신인걸 0번째로 둔다
       *  - 타겟 유저와의 채팅방의 ObjectId
       *
       * 유의할것
       *  - 채팅방을 만드는 경우도 있고, 채팅방 배열의 순서를 바꾸기도 한다.
       *  - get 보다 put 이 더 잘 어울린다.
       */

      if (!targetUserOId) {
        alert(`유저가 안 들어왔어요`)
        return
      }

      const url = `/client/userInfo/openUserChatRoom/${targetUserOId}`
      const data = {}
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setChatRoomRowArr(body.chatRoomRowArr)
            setOpenChatRoomOId(body.chatRoomOId)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [setChatRoomRowArr, setOpenChatRoomOId]
  )

  // GET AREA:
  const getChatArr = useCallback(
    (
      chatRoomOId: string,
      setChatArr: Setter<ChatType[]>,
      setIsDBLoaded: Setter<boolean> | null,
      setGoToBot: Setter<boolean> | null,
      firstIndex: number = -1
    ) => {
      const url = `/client/userInfo/getChatArr/${chatRoomOId}/${firstIndex}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setChatArr(prev => [...body.chatArr, ...prev])
            if (setIsDBLoaded) {
              setIsDBLoaded(true)
            }
            if (setGoToBot) {
              setGoToBot(true)
            }
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    []
  )

  const getChatRoom = useCallback((chatRoomOId: string, setChatRoom: Setter<ChatRoomType>) => {
    const url = `/client/userInfo/getChatRoom/${chatRoomOId}`
    getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj, jwtFromServer} = res
        if (ok) {
          setChatRoom(body.chatRoom)
          writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(err => alertErrors(url + ' CATCH', err))
  }, [])

  const getChatRoomRow = useCallback(
    (chatRoomOId: string) => {
      const url = `/client/userInfo/getChatRoomRow/${userOId}/${chatRoomOId}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setChatRoomRowArr(prev => [body.chatRoomRow, ...prev])
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(err => alertErrors(url + ' CATCH', err))
    },
    [userOId, setChatRoomRowArr]
  )

  const getChatRoomRowArr = useCallback(
    (userOId: string) => {
      if (userOId) {
        const url = `/client/userInfo/getChatRoomRowArr/${userOId}`

        getWithJwt(url)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setChatRoomRowArr(body.chatRoomRowArr)
              writeJwtFromServer(jwtFromServer)
            } // ::
            else {
              alertErrors(url + ' ELSE', errObj)
            }
          })
          .catch(err => alertErrors(url + ' CATCH', err))
      }
    },
    [setChatRoomRowArr]
  )

  const getNewAlarmArrLen = useCallback(() => {
    /**
     * 수신 확인 안 한 알람 갯수 가져오는 함수
     * - Header 에서 쓰임
     */
    if (userOId) {
      const url = `/client/userInfo/getNewAlarmArrLen/${userOId}`

      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setNewAlarmArrLen(body.newAlarmArrLen)
            writeJwtFromServer(jwtFromServer)
          } // ::
          else {
            alertErrors(url + ` ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(url + ` CATCH`, errObj))
    }
  }, [userOId, setNewAlarmArrLen])

  const refreshAlarmArr = useCallback(
    (setAlarmArr: Setter<AlarmType[]>, setIsLoading: Setter<boolean>) => {
      /**
       * 읽지 않은 알람들을 가져오며 수신처리를 한다
       * - Header 의 알람 목록창에서 사용
       * - 수신 확인 안한 알람 갯수는 서버에서 소켓통신으로 전달한다
       */
      if (userOId) {
        const url = `/client/userInfo/refreshAlarmArr/${userOId}`

        getWithJwt(url)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setAlarmArr(body.alarmArr)
              setIsLoading(false)
              writeJwtFromServer(jwtFromServer)
            } // ::
            else {
              alertErrors(url + ` ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(url + ` CATCH`, errObj))
      }
    },
    [userOId]
  )

  // DELETE AREA:
  const deleteAlarm = useCallback((alarm: AlarmType) => {
    const url = `/client/userInfo/deleteAlarm/${alarm.alarmOId}`
    delWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, errObj, jwtFromServer} = res
        if (ok) {
          writeJwtFromServer(jwtFromServer)
        } // ::
        else {
          alertErrors(url + ` ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(url + ` CATCH`, errObj))
  }, [])

  // prettier-ignore
  const value: ContextType = {
    openUserChatRoom,

    getChatArr,
    getChatRoom,
    getChatRoomRow,
    getChatRoomRowArr,
    getNewAlarmArrLen,
    refreshAlarmArr,

    deleteAlarm,
  }
  return <UserCallbacksContext.Provider value={value}>{children}</UserCallbacksContext.Provider>
}
