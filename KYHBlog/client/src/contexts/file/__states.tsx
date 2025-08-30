import {createContext, useContext, useState} from 'react'
import {NULL_FILE, NULL_USER} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'
import type {CommentType, FileType, UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  comment: string, setComment: Setter<string>
  commentArr: CommentType[], setCommentArr: Setter<CommentType[]>
  content: string, setContent: Setter<string>
  
  file: FileType, setFile: Setter<FileType>
  fileOId: string, setFileOId: Setter<string>
  fileName: string, setFileName: Setter<string>
  fileUser: UserType, setFileUser: Setter<UserType>

  isDelete: boolean, setIsDelete: Setter<boolean>
  isFileUserSelected: boolean, setIsFileUserSelected: Setter<boolean>
}
// prettier-ignore
export const FileStatesContext = createContext<ContextType>({
  comment: '', setComment: () => {},
  commentArr: [], setCommentArr: () => {},
  content: '', setContent: () => {},
  
  file: NULL_FILE, setFile: () => {},
  fileOId: '', setFileOId: () => {},
  fileName: '', setFileName: () => {},
  fileUser: NULL_USER, setFileUser: () => {},

  isDelete: false, setIsDelete: () => {},
  isFileUserSelected: false, setIsFileUserSelected: () => {}
})

export const useFileStatesContext = () => useContext(FileStatesContext)

export const FileStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * comment: 작성중인 댓글 내용
   * content: 파일 내용
   */
  const [comment, setComment] = useState<string>('')
  const [commentArr, setCommentArr] = useState<CommentType[]>([])
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
   * fileUser: 파일 작성자 정보
   *   - 파일에 저장된 정보랑 다를 수 있다
   *   - 파일 불러올때 서버에서 받아온다.
   */
  const [fileUser, setFileUser] = useState<UserType>(NULL_USER)
  /**
   * isDelete: 파일 삭제 확인용 모달 뜨는지 여부
   */
  const [isDelete, setIsDelete] = useState<boolean>(false)
  /**
   * isFileUserSelected: 파일 작성자 선택 모달 뜨는지 여부
   */
  const [isFileUserSelected, setIsFileUserSelected] = useState<boolean>(false)

  // prettier-ignore
  const value: ContextType = {
    comment, setComment,
    commentArr, setCommentArr,
    content, setContent,
    
    file, setFile,
    fileOId, setFileOId,
    fileName, setFileName,
    fileUser, setFileUser,

    isDelete, setIsDelete,
    isFileUserSelected, setIsFileUserSelected
  }

  return <FileStatesContext.Provider value={value}>{children}</FileStatesContext.Provider>
}
