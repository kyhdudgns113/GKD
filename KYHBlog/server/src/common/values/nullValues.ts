import * as T from '@common/types'

export function NULL_extraDirs(): T.ExtraDirObjectType {
  return {
    dirOIdsArr: [],
    directories: {}
  }
}
export function NULL_extraFileRows(): T.ExtraFileRowObjectType {
  return {
    fileOIdsArr: [],
    fileRows: {}
  }
}

export function NULL_User(): T.UserType {
  return {
    userAuth: 0,
    userName: '',
    userOId: '',
    userId: '',
    userMail: ''
  }
}
