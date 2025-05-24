export type ContentType = {
  type: 'string' | 'image'
  value: string
}
/**
 * Lefter 같은곳에서 OId 랑 name 만 사용하기 위해 쓰는 타입
 */
export type FileRowType = {
  fileOId: string
  name: string
}

export type DirectoryType = {
  dirName: string
  dirOId: string
  fileOIdsArr: string[]
  // isOpen?: boolean // 클라이언트에서 폴더 열렸는지 확인용 은 클라에서 따로 관리하자
  parentDirOId: string
  subDirOIdsArr: string[]
}
/**
 * 특정 디렉토리만 조작할때 쓰는 타입
 */
export type ExtraDirObjectType = {
  dirOIdsArr: string[]
  directories: {[dirOId: string]: DirectoryType}
}
/**
 * 특정 FileRow만 조작할때 쓰는 타입
 */
export type ExtraFileRowObjectType = {
  fileOIdsArr: string[]
  fileRows: {[fileOId: string]: FileRowType}
}
export type FileType = {
  contentsArr: ContentType[]
  fileOId: string
  name: string
}
export type UserType = {
  picture?: string
  signUpType?: 'local' | 'google'
  userAuth: number
  userId: string
  userName: string
  userOId: string
}
