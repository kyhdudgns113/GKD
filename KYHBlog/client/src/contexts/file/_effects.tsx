import {createContext, useContext, useEffect} from 'react'
import {useFileCallbacksContext} from './_callbacks'
import {useFileStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'
import {NULL_FILE} from '@nullValue'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const FileEffectsContext = createContext<ContextType>({})

export const useFileEffectsContext = () => useContext(FileEffectsContext)

export const FileEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {file, fileOId, setContent, setFile, setFileName} = useFileStatesContext()
  const {loadFile} = useFileCallbacksContext()

  // 초기화: file
  useEffect(() => {
    if (fileOId) {
      loadFile(fileOId)
    } // ::
    else {
      setFile(NULL_FILE)
    }
  }, [fileOId, loadFile, setFile])

  // 초기화: file 변경시
  useEffect(() => {
    if (fileOId) {
      const {fileName, content} = file
      setFileName(fileName)
      setContent(content)
    } // ::
    else {
      setFile(NULL_FILE)
    }
  }, [file, fileOId, setContent, setFile, setFileName])

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
