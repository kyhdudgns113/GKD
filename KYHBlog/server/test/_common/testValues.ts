import {AUTH_ADMIN, AUTH_GUEST, AUTH_USER} from '@secrets'

// AREA3: User Area

export const userOId_root: string = '000000000000000000000001'
export const userOId_user_0: string = '000000000000000000000002'
export const userOId_user_1: string = '000000000000000000000003'
export const userOId_banned: string = '000000000000000000000004'

export const userInfo_root = {
  password: 'authRootPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonRoot',
  userOId: userOId_root,
  userMail: 'root@root.root',
  userName: 'commonRoot',
  userAuth: AUTH_ADMIN
}
export const userInfo_user_0 = {
  password: 'authUserPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonUser0',
  userOId: userOId_user_0,
  userMail: 'user0@user.user',
  userName: 'commonUser0',
  userAuth: AUTH_USER
}
export const userInfo_user_1 = {
  password: 'authUserPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonUser1',
  userOId: userOId_user_1,
  userMail: 'user1@user.user',
  userName: 'commonUser1',
  userAuth: AUTH_USER
}
export const userInfo_banned = {
  password: 'authBannedPassword1!',
  picture: '',
  signUpType: 'common',
  userId: 'commonBan',
  userOId: userOId_banned,
  userMail: 'ban@ban.ban',
  userName: 'commonBan',
  userAuth: AUTH_GUEST
}

// AREA1: Directory Area

export const dirOId_root: string = '000000000000000000010000'
export const dirOId_0: string = '000000000000000000010100'
export const dirOId_1: string = '000000000000000000010200'

export const dirInfo_root = {
  dirIdx: 0,
  dirName: 'root',
  dirOId: dirOId_root,
  fileArrLen: 1,
  subDirArrLen: 2,
  parentDirOId: null
}
export const dirInfo_0 = {
  dirIdx: 0,
  dirName: 'dir0',
  dirOId: dirOId_0,
  fileArrLen: 1,
  subDirArrLen: 0,
  parentDirOId: dirOId_root
}
export const dirInfo_1 = {
  dirIdx: 1,
  dirName: 'dir1',
  dirOId: dirOId_1,
  fileArrLen: 1,
  subDirArrLen: 0,
  parentDirOId: dirOId_root
}

// AREA2: File Area

export const fileOId_root: string = '000000000000000000010001'
export const fileOId_0: string = '000000000000000000010101'
export const fileOId_1: string = '000000000000000000010201'

export const fileInfo_root = {
  content: 'content0',
  dirOId: dirOId_root,
  fileIdx: 0,
  fileOId: fileOId_root,
  fileStatus: 0,
  fileName: 'file_0',
  userName: userInfo_root.userName,
  userOId: userOId_root
}
export const fileInfo_0 = {
  content: 'content1',
  dirOId: dirOId_0,
  fileIdx: 0,
  fileOId: fileOId_0,
  fileStatus: 0,
  fileName: 'file_0_0',
  userName: userInfo_root.userName,
  userOId: userOId_root
}
export const fileInfo_1 = {
  content: 'content2',
  dirOId: dirOId_1,
  fileIdx: 0,
  fileOId: fileOId_1,
  fileStatus: 0,
  fileName: 'file_1_0',
  userName: userInfo_root.userName,
  userOId: userOId_root
}
