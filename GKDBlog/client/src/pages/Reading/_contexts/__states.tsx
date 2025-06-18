import {createContext, useContext, useState} from 'react'

import {NULL_FILE} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'
import type {CommentType, FileType} from '@shareType'

// prettier-ignore
type ContextType = {
  commentsArr: CommentType[], setCommentsArr: Setter<CommentType[]>
  file: FileType, setFile: Setter<FileType>
  fileOId: string, setFileOId: Setter<string>
  isFileLoaded: boolean, setIsFileLoaded: Setter<boolean>
}
// prettier-ignore
export const ReadingPageStatesContext = createContext<ContextType>({
  commentsArr: [], setCommentsArr: () => {},
  file: NULL_FILE, setFile: () => {},
  fileOId: '', setFileOId: () => {},
  isFileLoaded: false, setIsFileLoaded: () => {},
})

export const useReadingPageStatesContext = () => useContext(ReadingPageStatesContext)

export const ReadingPageStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [commentsArr, setCommentsArr] = useState<CommentType[]>([])
  const [file, setFile] = useState<FileType>(NULL_FILE)
  const [fileOId, setFileOId] = useState<string>('')
  /**
   * isFileLoaded: 파일 로딩이 됬는지 여부
   * - 파일이 로딩이 되고나서 파일 내용을 markdown 용으로 변환할 수 있다.
   */
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false)

  // prettier-ignore
  const value: ContextType = {
    commentsArr, setCommentsArr,
    file, setFile,
    fileOId, setFileOId,
    isFileLoaded, setIsFileLoaded,
  }

  return (
    <ReadingPageStatesContext.Provider value={value}>{children}</ReadingPageStatesContext.Provider>
  )
}
