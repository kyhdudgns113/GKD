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
