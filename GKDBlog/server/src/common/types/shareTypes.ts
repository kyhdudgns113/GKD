export type ContentType = {
  type: 'string' | 'image'
  value: string
}

export type DirectoryType = {
  dirName: string
  dirOId: string
  fileOIDsArr: string[]
  subdirOIDsArr: string[]
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
