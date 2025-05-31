import type {ContentType} from './shareTypes'

export type AddDirectoryDataType = {
  dirName: string
  parentDirOId: string
}
export type AddFileDataType = {
  fileName: string
  parentDirOId: string
}
/**
 * 로컬 방식 로그인 타입
 */
export type LogInDataType = {
  userId: string
  password: string
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
