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
  const [content, setContent] = useState<string>('')
  /**
   * file: 파일 정보, fileOId 가 변하면 서버로부터 읽어온다
   * fileOId: 현재 열려있는 파일의 OId, URL 에서 받아온다.
   * fileName: 파일 이름, file 변경시 혹은 파일이름 변경시 반영된다
   */
  const [file, setFile] = useState<FileType>(NULL_FILE)
  const [fileOId, setFileOId] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  /**
   * isDelete: 파일 삭제 확인용 모달 뜨는지 여부
   */
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
