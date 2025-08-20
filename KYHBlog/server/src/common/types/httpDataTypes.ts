export type AddDirectoryType = {
  dirName: string
  parentDirOId: string
}
export type AddFileType = {
  fileName: string
  dirOId: string
}

export type LogInDataType = {
  /**
   * 로컬 방식 로그인 타입
   */
  userId: string
  password: string
}
export type SignUpDataType = {
  userId: string
  userName: string
  password: string
}
