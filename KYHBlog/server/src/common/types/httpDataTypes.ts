export type AddDirectoryType = {
  dirName: string
  parentDirOId: string
}

export type AddFileType = {
  dirOId: string
  fileName: string
}

export type LogInDataType = {
  /**
   * 로컬 방식 로그인 타입
   */
  password: string
  userId: string
}

export type MoveDirectoryType = {
  moveDirOId: string
  oldParentDirOId: string // 기존 부모 폴더의 OId
  oldParentChildArr: string[] // 기존 부모 폴더의 자식 디렉토리 OId 배열
  newParentDirOId: string // 새로운 부모 폴더의 OId
  newParentChildArr: string[] // 새로운 부모 폴더의 자식 디렉토리 OId 배열
}

export type MoveFileType = {
  moveFileOId: string
  oldParentDirOId: string // 기존 부모 폴더의 OId
  oldParentChildArr: string[] // 기존 부모 폴더의 자식 파일 OId 배열
  newParentDirOId: string // 새로운 부모 폴더의 OId
  newParentChildArr: string[] // 새로운 부모 폴더의 자식 파일 OId 배열
}

export type SignUpDataType = {
  password: string
  userId: string
  userName: string
}
