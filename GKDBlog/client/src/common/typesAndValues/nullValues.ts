import type {DirectoryType} from './shareTypes'
import type {AuthBodyType} from './types'

export const NULL_AUTH_BODY: AuthBodyType = {
  jwtFromServer: '',
  picture: '',
  userAuth: 0,
  userId: '',
  userName: '',
  userOId: ''
}

export const NULL_DIR: DirectoryType = {
  dirName: '',
  dirOId: '',
  fileOIdsArr: [],
  subDirOIdsArr: []
}
