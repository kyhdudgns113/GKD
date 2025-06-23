import type {ContentType} from './shareTypes'

export type AddCommentDataType = {
  content: string
  fileOId: string
  userOId: string
}
export type AddDirectoryDataType = {
  dirName: string
  parentDirOId: string
}
export type AddFileDataType = {
  fileName: string
  parentDirOId: string
}
export type AddReplyDataType = {
  commentOId: string
  targetUserName: string
  targetUserOId: string
  content: string
}
export type DeleteReplyDataType = {
  commentOId: string
  dateString: string
  userOId: string
}
/**
 * 로컬 방식 로그인 타입
 */
export type LogInDataType = {
  userId: string
  password: string
}
export type ModifyCommentDataType = {
  commentOId: string
  content: string
}
export type ModifyReplyDataType = {
  commentOId: string
  content: string
  dateString: string
  userOId: string
}
export type MoveDirectoryDataType = {
  moveDirOId: string
  parentDirOId: string
  targetIdx: number | null
}
export type MoveFileDataType = {
  moveFileOId: string
  targetDirOId: string
  targetIdx: number | null
}
export type SetDirNameDataType = {
  dirOId: string
  newDirName: string
}
export type SignUpDataType = {
  userId: string
  userName: string
  password: string
}
export type SetFileNameContentsDataType = {
  contentsArr: ContentType[]
  fileOId: string
  name: string
}
