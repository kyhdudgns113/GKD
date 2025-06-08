import {createContext, useContext, useEffect} from 'react'

import {useReadingPageCallbacksContext} from './_callbacks'
import {useReadingPageStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const ReadingPageEffectsContext = createContext<ContextType>({
  
})

export const useReadingPageEffectsContext = () => useContext(ReadingPageEffectsContext)

export const ReadingPageEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {fileOId, isFileLoaded, setIsFileLoaded} = useReadingPageStatesContext()
  const {readFile} = useReadingPageCallbacksContext()

  // fileOId 바뀔때마다 isFileLoaded 를 false 로 초기화한다.
  useEffect(() => {
    setIsFileLoaded(false)
  }, [fileOId, setIsFileLoaded])

  /**
   * 파일 읽어오는 부분
   * - fileOId 가 바뀔때마다 실행한다.
   * - DB 에서 읽어오지 않았을때만 실행한다.
   */
  useEffect(() => {
    if (fileOId && !isFileLoaded) {
      readFile(fileOId)
    }
  }, [fileOId, isFileLoaded, readFile, setIsFileLoaded])

  return (
    <ReadingPageEffectsContext.Provider value={{}}>{children}</ReadingPageEffectsContext.Provider>
  )
}
