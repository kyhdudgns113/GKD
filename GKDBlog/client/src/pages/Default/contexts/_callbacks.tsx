import {createContext, useCallback, useContext} from 'react'

import {get} from '@server'
import {alertErrors} from '@util'

import {useDefaultPageStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  readIntroFile: () => void
}
// prettier-ignore
export const DefaultPageCallbacksContext = createContext<ContextType>({
  readIntroFile: () => {}
})

export const useDefaultPageCallbacksContext = () => useContext(DefaultPageCallbacksContext)

export const DefaultPageCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setFile} = useDefaultPageStatesContext()

  const readIntroFile = useCallback(() => {
    /**
     * 공지로 등록한 파일을 불러온다.
     * - 로그인을 안해도 확인할 수 있어야 하기에 jwt 를 검증하지 않는다.
     */
    const url = `/client/default/readIntroFile`
    const jwt = ''
    get(url, jwt)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj} = res
        if (ok) {
          if (body.file) {
            setFile(body.file)
          }
        } // ::
        else {
          alertErrors(url + ` ELSE`, errObj)
        }
      })
      .catch(err => alertErrors(url + ` CATCH`, err))
  }, [setFile])

  // prettier-ignore
  const value: ContextType = {
    readIntroFile
  }
  return <DefaultPageCallbacksContext.Provider value={value}>{children}</DefaultPageCallbacksContext.Provider>
}
