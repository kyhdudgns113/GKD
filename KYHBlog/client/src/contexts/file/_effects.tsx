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
  const {file, fileOId, setCommentArr, setContent, setFile, setFileName} = useFileStatesContext()
  const {loadComments, loadFile} = useFileCallbacksContext()

  // 초기화: file 및 commentArr
  useEffect(() => {
    if (fileOId) {
      loadFile(fileOId)
      loadComments(fileOId, 1)
    } // ::
    else {
      setFile(NULL_FILE)
      setCommentArr([])
    }
  }, [fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: file 다른걸로 변경시
  useEffect(() => {
    if (fileOId) {
      const {fileName, content} = file
      setFileName(fileName)
      setContent(content)
    } // ::
    else {
      setFile(NULL_FILE)
    }
  }, [file, fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
