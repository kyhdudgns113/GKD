import {FC, PropsWithChildren, useCallback, useContext} from 'react'
import {createContext} from 'react'
import {alertErrors, writeJwtFromServer} from '../../../../common/utils'
import {getWithJwt} from '../../../../common/server'
import {useChattingPartStatesContext} from './__states'

// prettier-ignore
type ContextType = {
  readPrevMessage: (clubOId: string, firstIdx: number) => void
}
// prettier-ignore
export const ChattingPartCallbacksContext = createContext<ContextType>({
  readPrevMessage: () => {}
})

export const useChattingPartCallbacksContext = () => useContext(ChattingPartCallbacksContext)

export const ChattingPartCallbacks: FC<PropsWithChildren> = ({children}) => {
  const {setChatsArr} = useChattingPartStatesContext()

  const readPrevMessage = useCallback(
    (clubOId: string, firstIdx: number) => {
      const url = `/client/chat/getChatsArr/${clubOId}/${firstIdx}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setChatsArr(prev => [...body.chatsArr, ...prev])
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setChatsArr]
  )

  // prettier-ignore
  const value = {
    readPrevMessage
  }
  return (
    <ChattingPartCallbacksContext.Provider value={value}>
      {children}
    </ChattingPartCallbacksContext.Provider>
  )
}
