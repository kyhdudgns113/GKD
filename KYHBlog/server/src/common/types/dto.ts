export type CreateDirDTO = {
  dirName: string
  parentDirOId: string
}

export type CreateFileDTO = {
  dirOId: string
  fileName: string
  userName: string
  userOId: string
}

export type SignUpDTO = {
  userId: string
  userName: string
  password: string
  picture: string
  signUpType: 'common' | 'google'
}
