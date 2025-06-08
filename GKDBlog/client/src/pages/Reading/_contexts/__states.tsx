import {createContext, useContext, useState} from 'react'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'
import type {FileType} from '@shareType'
import {NULL_FILE} from '@nullValue'

// prettier-ignore
type ContextType = {
  file: FileType, setFile: Setter<FileType>
  fileOId: string, setFileOId: Setter<string>
  isFileLoaded: boolean, setIsFileLoaded: Setter<boolean>
}
// prettier-ignore
export const ReadingPageStatesContext = createContext<ContextType>({
  file: NULL_FILE, setFile: () => {},
  fileOId: '', setFileOId: () => {},
  isFileLoaded: false, setIsFileLoaded: () => {},
})

export const useReadingPageStatesContext = () => useContext(ReadingPageStatesContext)

export const ReadingPageStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [file, setFile] = useState<FileType>(NULL_FILE)
  const [fileOId, setFileOId] = useState<string>('')
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false)

  // prettier-ignore
  const value: ContextType = {
    file, setFile,
    fileOId, setFileOId,
    isFileLoaded, setIsFileLoaded,
  }

  return (
    <ReadingPageStatesContext.Provider value={value}>{children}</ReadingPageStatesContext.Provider>
  )
}
