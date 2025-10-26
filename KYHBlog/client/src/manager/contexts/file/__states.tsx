import {createContext, useContext, useState} from 'react'
import {NULL_FILE, NULL_USER} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'
import type {CommentType, FileType, ReplyType, UserType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  comment: string, setComment: Setter<string>
  commentReplyArr: (CommentType | ReplyType)[], setCommentReplyArr: Setter<(CommentType | ReplyType)[]>
  commentOId_delete: string, setCommentOId_delete: Setter<string>
  commentOId_edit: string, setCommentOId_edit: Setter<string>
  commentOId_reply: string, setCommentOId_reply: Setter<string>
  commentOId_user: string, setCommentOId_user: Setter<string>
  content: string, setContent: Setter<string>
  
  entireCommentReplyLen: number, setEntireCommentReplyLen: Setter<number>
  
  file: FileType, setFile: Setter<FileType>
  fileOId: string, setFileOId: Setter<string>
  fileName: string, setFileName: Setter<string>
  fileUser: UserType, setFileUser: Setter<UserType>

  isDelete: boolean, setIsDelete: Setter<boolean>
  isFileUserSelected: boolean, setIsFileUserSelected: Setter<boolean>
  
  pageIdx: number, setPageIdx: Setter<number>
  pageTenIdx: number, setPageTenIdx: Setter<number>
  
  replyContent: string, setReplyContent: Setter<string>
  replyOId_delete: string, setReplyOId_delete: Setter<string>
  replyOId_edit: string, setReplyOId_edit: Setter<string>
  replyOId_reply: string, setReplyOId_reply: Setter<string>
  replyOId_user: string, setReplyOId_user: Setter<string>

  stringArr: string[], setStringArr: Setter<string[]>
}
// prettier-ignore
export const FileStatesContext = createContext<ContextType>({
  comment: '', setComment: () => {},
  commentReplyArr: [], setCommentReplyArr: () => {},
  commentOId_delete: '', setCommentOId_delete: () => {},
  commentOId_edit: '', setCommentOId_edit: () => {},
  commentOId_reply: '', setCommentOId_reply: () => {},
  commentOId_user: '', setCommentOId_user: () => {},
  content: '', setContent: () => {},
  
  entireCommentReplyLen: 0, setEntireCommentReplyLen: () => {},
  
  file: NULL_FILE, setFile: () => {},
  fileOId: '', setFileOId: () => {},
  fileName: '', setFileName: () => {},
  fileUser: NULL_USER, setFileUser: () => {},

  isDelete: false, setIsDelete: () => {},
  isFileUserSelected: false, setIsFileUserSelected: () => {},
  
  pageIdx: 0, setPageIdx: () => {},
  pageTenIdx: 0, setPageTenIdx: () => {},

  replyContent: '', setReplyContent: () => {},
  replyOId_delete: '', setReplyOId_delete: () => {},
  replyOId_edit: '', setReplyOId_edit: () => {},
  replyOId_reply: '', setReplyOId_reply: () => {},
  replyOId_user: '', setReplyOId_user: () => {},

  stringArr: [], setStringArr: () => {},
})

export const useFileStatesContext = () => useContext(FileStatesContext)

export const FileStatesProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * comment: 작성중인 댓글 내용
   * commentOId_delete: 삭제할 댓글의 OId
   * commentOId_edit: 수정할 댓글의 OId
   * commentOId_reply: 대댓글 작성할 댓글의 OId
   * commentOId_user: 작성된 유저가 선택된 댓글의 OId
   * commentReplyArr: 파일의 댓글 목록
   * content: 파일 내용
   */
  const [comment, setComment] = useState<string>('')
  const [commentOId_delete, setCommentOId_delete] = useState<string>('')
  const [commentOId_edit, setCommentOId_edit] = useState<string>('')
  const [commentOId_reply, setCommentOId_reply] = useState<string>('')
  const [commentOId_user, setCommentOId_user] = useState<string>('')
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
  const [pageIdx, setPageIdx] = useState<number>(0)
  const [pageTenIdx, setPageTenIdx] = useState<number>(0)
  /**
   * replyContent: 대댓글 작성 내용
   * replyOId_delete: 삭제할 대댓글의 OId
   * replyOId_edit: 수정할 대댓글의 OId
   * replyOId_reply: 수정할 대댓글의 OId
   * replyOId_user: 작성된 유저가 선택된 대댓글의 OId
   */
  const [replyContent, setReplyContent] = useState<string>('')
  const [replyOId_delete, setReplyOId_delete] = useState<string>('')
  const [replyOId_edit, setReplyOId_edit] = useState<string>('')
  const [replyOId_reply, setReplyOId_reply] = useState<string>('')
  const [replyOId_user, setReplyOId_user] = useState<string>('')
  /**
   * stringArr: 마크다운 적용할 문자열 배열
   */
  const [stringArr, setStringArr] = useState<string[]>([])

  // prettier-ignore
  const value: ContextType = {
    comment, setComment,
    commentReplyArr, setCommentReplyArr,
    commentOId_delete, setCommentOId_delete,
    commentOId_edit, setCommentOId_edit,
    commentOId_reply, setCommentOId_reply,
    commentOId_user, setCommentOId_user,
    content, setContent,

    entireCommentReplyLen, setEntireCommentReplyLen,

    file, setFile,
    fileOId, setFileOId,
    fileName, setFileName,
    fileUser, setFileUser,

    isDelete, setIsDelete,
    isFileUserSelected, setIsFileUserSelected,

    pageIdx, setPageIdx,
    pageTenIdx, setPageTenIdx,
    
    replyContent, setReplyContent,
    replyOId_delete, setReplyOId_delete,
    replyOId_edit, setReplyOId_edit,
    replyOId_reply, setReplyOId_reply,
    replyOId_user, setReplyOId_user,
    
    stringArr, setStringArr,
  }

  return <FileStatesContext.Provider value={value}>{children}</FileStatesContext.Provider>
}
