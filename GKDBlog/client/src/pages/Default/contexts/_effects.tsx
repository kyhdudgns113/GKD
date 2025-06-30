import {createContext, useContext, useEffect} from 'react'

import {useDefaultPageCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const DefaultPageEffectsContext = createContext<ContextType>({})

export const useDefaultPageEffectsContext = () => useContext(DefaultPageEffectsContext)

export const DefaultPageEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {readIntroFile} = useDefaultPageCallbacksContext()

  // 페이지 로딩시 공지로 등록한 파일을 불러온다.
  useEffect(() => {
    readIntroFile()
  }, [readIntroFile])

  return <DefaultPageEffectsContext.Provider value={{}}>{children}</DefaultPageEffectsContext.Provider>
}
