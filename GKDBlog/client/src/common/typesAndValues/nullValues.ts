import type {ChatRoomType, DirectoryType, FileType} from './shareTypes'
import type {AuthBodyType} from './types'

export const NULL_AUTH_BODY: AuthBodyType = {
  jwtFromServer: '',
  picture: '',
  userAuth: 0,
  userId: '',
  userName: '',
  userOId: ''
}

export const NULL_CHAT_ROOM: ChatRoomType = {
  chatRoomOId: '',
  targetUserOId: '',
  targetUserName: '',
  lastChatDate: new Date(),
  userOIdsArr: []
}

export const NULL_DIR: DirectoryType = {
  dirName: '',
  dirOId: '',
  fileOIdsArr: [],
  parentDirOId: '',
  subDirOIdsArr: []
}

export const NULL_FILE: FileType = {
  contentsArr: [],
  fileOId: '',
  name: '',
  parentDirOId: ''
}
