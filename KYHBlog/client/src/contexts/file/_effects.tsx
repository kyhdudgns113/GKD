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
  const {fileOId, setFile} = useFileStatesContext()
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

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
