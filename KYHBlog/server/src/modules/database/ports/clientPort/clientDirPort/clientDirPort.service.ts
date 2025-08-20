import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as V from '@values'
import * as T from '@common/types'

@Injectable()
export class ClientDirPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // GET AREA:

  /**
   * loadRootDirectory
   *
   *  - DB 에서 루트 디렉토리를 가져온다
   *  - 루트 디렉토리가 없으면 생성한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 루트 디렉토리 DB 에서 조회 뙇!!
   *  2. 존재할때
   *    2-1. extraDirs 에 루트 디렉토리 넣기
   *    2-2. extraFileRows 에 루트 디렉토리의 자식 파일행들 넣기
   *    2-3. 자식 디렉토리 배열 및 그들의 자식파일행 배열 조회 뙇!!
   *    2-4. 그 정보들 extraDirs 및 extraFileRows 에 넣기
   *  3. 없을때
   *    3-1. 루트 디렉토리 생성 뙇!!
   *    3-2. extraDirs 에 루트 디렉토리 넣기
   *  4. rootDirOId, extraDirs, extraFileRows 반환 뙇!!
   *
   * ------
   *
   * 리턴
   *
   *  - rootDirOId: 루트 디렉토리의 OId
   *
   *  - extraDirs: 루트 디렉토리와 자식 디렉토리들의 정보
   *    - 루트 디렉토리부터 BFS 방식으로 저장한다.
   *
   *  - extraFileRows: 루트와 자식 폴더들의 파일행 정보
   *    - 루트의 0번째 파일부터 BFS 방식으로 저장한다.
   *
   */
  async loadRootDirectory() {
    const where = `/client/directory/loadRootDirectory`

    try {
      // 1. 루트 디렉토리 DB 에서 조회 뙇!!
      const {directory, fileRowArr: _rootsFileRowArr} = await this.dbHubService.readDirRoot(where)

      let rootDirOId: string = ''

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows

      if (directory) {
        // 2. 존재할때
        rootDirOId = directory.dirOId

        // 2-1. extraDirs 와 extraFileRows 에 정보 삽입 뙇!!
        this._pushExtraDirs_Single(where, extraDirs, directory)
        this._pushExtraFileRows_Arr(where, extraFileRows, _rootsFileRowArr)

        // 2-3. 자식 디렉토리 배열 및 그들의 자식파일행 배열 조회 뙇!!
        const {directoryArr, fileRowArr} = await this.dbHubService.readDirArrByParentDirOId(where, rootDirOId)

        // 2-4. 그 정보들 extraDirs 및 extraFileRows 에 삽입 뙇!!
        this._pushExtraDirs_Arr(where, extraDirs, directoryArr)
        this._pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)
      } // ::
      else {
        // 3. 없을때

        // 3-1. 루트 디렉토리 생성 뙇!!
        const {directory} = await this.dbHubService.createDirRoot(where)
        rootDirOId = directory.dirOId

        // 3-2. extraDirs 에 루트 디렉토리 삽입 뙇!!
        this._pushExtraDirs_Single(where, extraDirs, directory)
      }

      return {rootDirOId, extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA6: private functions

  /**
   *
   */
  private _pushExtraDirs_Arr(where: string, extraDirs: T.ExtraDirObjectType, directoryArr: T.DirectoryType[]) {
    directoryArr.forEach((directory: T.DirectoryType) => {
      this._pushExtraDirs_Single(where, extraDirs, directory)
    })
  }

  /**
   *
   */
  private _pushExtraDirs_Single(where: string, extraDirs: T.ExtraDirObjectType, directory: T.DirectoryType) {
    extraDirs.dirOIdsArr.push(directory.dirOId)
    extraDirs.directories[directory.dirOId] = directory
  }

  /**
   *
   */
  private _pushExtraFileRows_Arr(where: string, extraFileRows: T.ExtraFileRowObjectType, fileRowArr: T.FileRowType[]) {
    fileRowArr.forEach((fileRow: T.FileRowType) => {
      this._pushExtraFileRows_Single(where, extraFileRows, fileRow)
    })
  }

  /**
   *
   */
  private _pushExtraFileRows_Single(where: string, extraFileRows: T.ExtraFileRowObjectType, fileRow: T.FileRowType) {
    extraFileRows.fileOIdsArr.push(fileRow.fileOId)
    extraFileRows.fileRows[fileRow.fileOId] = fileRow
  }

  /**
   * dirOId 디렉토리의 정보(OID 배열 정보들 포함)을 extraDirs 에 넣는다.
   * 해당 디렉토리의 자식 파일행들의 정보를 extraFileRows 에 넣는다.
   * - 자식 폴더들의 정보는 extraDirs 에 넣지 않는다.
   *
   * 1. 디렉토리 조회 뙇!!
   * 2. 자기 정보 extraDirs 에 삽입 뙇!!
   * 3. 자식 파일행들 extraFileRows 및 fileOIdsArr 에 삽입 뙇!!
   */
  private async _setDirectorysExtraInfo(where: string, dirOId: string, extraDirs: T.ExtraDirObjectType, extraFileRows: T.ExtraFileRowObjectType) {
    try {
      // 1. 디렉토리 조회 뙇!!
      const {directory, fileRowArr} = await this.dbHubService.readDirByDirOId(where, dirOId)

      if (!directory) return

      // 2. 자기 정보 extraDirs 에 삽입 뙇!!
      extraDirs.dirOIdsArr.push(dirOId)
      extraDirs.directories[dirOId] = directory

      // 3. 자식 파일행들 extraFileRows 및 fileOIdsArr 에 삽입 뙇!!
      fileRowArr.forEach((fileRow: T.FileRowType) => {
        extraFileRows.fileOIdsArr.push(fileRow.fileOId)
        extraFileRows.fileRows[fileRow.fileOId] = fileRow
      })

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
