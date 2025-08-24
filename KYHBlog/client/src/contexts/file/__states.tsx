import {createContext, useContext, useState} from 'react'
import {NULL_FILE} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'
import type {FileType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  file: FileType, setFile: Setter<FileType>
  content: string, setContent: Setter<string>
  fileOId: string, setFileOId: Setter<string>
  fileName: string, setFileName: Setter<string>
  isDelete: boolean, setIsDelete: Setter<boolean>
}
// prettier-ignore
export const FileStatesContext = createContext<ContextType>({
  file: NULL_FILE, setFile: () => {},
  content: '', setContent: () => {},
  fileOId: '', setFileOId: () => {},
  fileName: '', setFileName: () => {},
  isDelete: false, setIsDelete: () => {}
})

export const useFileStatesContext = () => useContext(FileStatesContext)

export const FileStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [file, setFile] = useState<FileType>(NULL_FILE)
  const [content, setContent] = useState<string>('')
  const [fileOId, setFileOId] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [isDelete, setIsDelete] = useState<boolean>(false)

  // prettier-ignore
  const value: ContextType = {
    file, setFile,
    content, setContent,
    fileOId, setFileOId,
    fileName, setFileName,
    isDelete, setIsDelete
  }

  return <FileStatesContext.Provider value={value}>{children}</FileStatesContext.Provider>
}
