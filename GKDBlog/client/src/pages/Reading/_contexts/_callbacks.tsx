import {get} from '@server/getAndDel'
import {alertErrors} from '@utils/alertErrors'
import {createContext, useCallback, useContext} from 'react'

import {useReadingPageStatesContext} from './__states'
import {useAuthCallbacksContext} from '@contexts/auth/_callbacks'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  readFile: (fileOId: string) => void
}
// prettier-ignore
export const ReadingPageCallbacksContext = createContext<ContextType>({
  readFile: () => {},
})

export const useReadingPageCallbacksContext = () => useContext(ReadingPageCallbacksContext)

export const ReadingPageCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {refreshToken} = useAuthCallbacksContext()
  const {setFile, setIsFileLoaded} = useReadingPageStatesContext()

  const readFile = useCallback(
    async (fileOId: string) => {
      // 토큰 갱신을 하기 위한 목적으로만 호출함.
      // 권한체크 안한다.
      await refreshToken(0)

      if (!fileOId) {
        alert('fileOId 가 없습니다.')
        return
      }

      const url = `/client/reading/readFile/${fileOId}`
      const jwt = ''

      get(url, jwt)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            setFile(body.file)
            setIsFileLoaded(true)
          } // ::
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setFile, setIsFileLoaded, refreshToken]
  )

  // prettier-ignore
  const value: ContextType = {
    readFile,
  }
  return (
    <ReadingPageCallbacksContext.Provider value={value}>
      {children}
    </ReadingPageCallbacksContext.Provider>
  )
}
