import {createContext, useContext, useState} from 'react'
import {NULL_FILE, NULL_USER} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'
import type {CommentType, FileType, ReplyType, UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  comment: string, setComment: Setter<string>
  commentReplyArr: (CommentType | ReplyType)[], setCommentReplyArr: Setter<(CommentType | ReplyType)[]>
  commentOId_edit: string, setCommentOId_edit: Setter<string>
  content: string, setContent: Setter<string>
  
  entireCommentReplyLen: number, setEntireCommentReplyLen: Setter<number>
  
  file: FileType, setFile: Setter<FileType>
  fileOId: string, setFileOId: Setter<string>
  fileName: string, setFileName: Setter<string>
  fileUser: UserType, setFileUser: Setter<UserType>

  isDelete: boolean, setIsDelete: Setter<boolean>
  isFileUserSelected: boolean, setIsFileUserSelected: Setter<boolean>
  
  pageIdx: number, setPageIdx: Setter<number>
}
// prettier-ignore
export const FileStatesContext = createContext<ContextType>({
  comment: '', setComment: () => {},
  commentReplyArr: [], setCommentReplyArr: () => {},
  commentOId_edit: '', setCommentOId_edit: () => {},
  content: '', setContent: () => {},
  
  entireCommentReplyLen: 0, setEntireCommentReplyLen: () => {},
  
  file: NULL_FILE, setFile: () => {},
  fileOId: '', setFileOId: () => {},
  fileName: '', setFileName: () => {},
  fileUser: NULL_USER, setFileUser: () => {},

  isDelete: false, setIsDelete: () => {},
  isFileUserSelected: false, setIsFileUserSelected: () => {},
  
  pageIdx: 1, setPageIdx: () => {}
})

export const useFileStatesContext = () => useContext(FileStatesContext)

export const FileStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * comment: 작성중인 댓글 내용
   * commentOId_edit: 수정할 댓글의 OId
   * commentReplyArr: 파일의 댓글 목록
   * content: 파일 내용
   */
  const [comment, setComment] = useState<string>('')
  const [commentOId_edit, setCommentOId_edit] = useState<string>('')
  const [commentReplyArr, setCommentReplyArr] = useState<(CommentType | ReplyType)[]>([])
  const [content, setContent] = useState<string>('')
  /**
   * entireCommentReplyLen: 페이지의 전체 댓글 및 대댓글 갯수
   */
  const [entireCommentReplyLen, setEntireCommentReplyLen] = useState<number>(0)
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
   * isFileUserSelected: 파일 작성자 선택 모달 뜨는지 여부
   */
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [isFileUserSelected, setIsFileUserSelected] = useState<boolean>(false)
  /**
   * pageIdx: 현재 페이지의 댓글 인덱스
   */
  const [pageIdx, setPageIdx] = useState<number>(1)

  // prettier-ignore
  const value: ContextType = {
    comment, setComment,
    commentReplyArr, setCommentReplyArr,
    commentOId_edit, setCommentOId_edit,
    content, setContent,
    
    entireCommentReplyLen, setEntireCommentReplyLen,
    
    file, setFile,
    fileOId, setFileOId,
    fileName, setFileName,
    fileUser, setFileUser,

    isDelete, setIsDelete,
    isFileUserSelected, setIsFileUserSelected,
    
    pageIdx, setPageIdx
  }

  return <FileStatesContext.Provider value={value}>{children}</FileStatesContext.Provider>
}
