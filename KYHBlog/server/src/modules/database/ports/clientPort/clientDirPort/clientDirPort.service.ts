import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'

@Injectable()
export class ClientDirPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // GET AREA:

  async loadRootDirectory() {
    const where = `/client/directory/loadRootDirectory`

    /**
     * DB 에서 루트 디렉토리를 가져온다
     * 루트 디렉토리가 없으면 생성한다
     *
     * 1. 루트 디렉토리 DB 에서 조회 뙇!!
     * 2. 존재할때
     *   2-1. extraDirs 에 루트 디렉토리 넣기
     *   2-2. 자식 디렉토리들 조회 뙇!!
     *   2-3. 자식 디렉토리들 extraDirs 및 subDirOIdsArr 에 넣기
     *   2-4. 자식 파일들 조회 뙇!!
     *   2-5. 자식 파일들 extraFileRows 및 fileOIdsArr 에 넣기
     * 3. 없을때
     *   3-1. 루트 디렉토리 생성 뙇!!
     *   3-2. extraDirs 에 루트 디렉토리 넣기
     * 4. rootDirOId, extraDirs, extraFileRows 반환 뙇!!
     */
    try {
      // 1. 루트 디렉토리 DB 에서 조회 뙇!!
      const {directory} = await this.dbHubService.readDirRoot(where)

      const rootDir: T.DirectoryType = directory
      let rootDirOId: string = ''

      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [],
        directories: {}
      }
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }

      if (directory) {
        // 2. 존재할때

        // 2-1. extraDirs 에 루트 디렉토리 넣기
        rootDirOId = directory.dirOId

        extraDirs.dirOIdsArr.push(rootDirOId)
        extraDirs.directories[rootDirOId] = directory

        // 2-2. 자식 디렉토리들 조회 뙇!!
        const {directoryArr} = await this.dbHubService.readDirArrByParentDirOId(where, rootDirOId)
        const arrLen = directoryArr.length

        // 2-3. 자식 디렉토리들 extraDirs 및 subDirOIdsArr 에 넣기
        for (let dirIdx = 0; dirIdx < arrLen; dirIdx++) {
          const directory = directoryArr[dirIdx]

          // 2-3-1. 자식 폴더의 자식 폴더들의 OId 배열을 넣어준다.
          const {directoryArr: _arr} = await this.dbHubService.readDirArrByParentDirOId(where, directory.dirOId)
          _arr.forEach((dir: T.DirectoryType) => {
            directory.subDirOIdsArr.push(dir.dirOId)
          })

          // 2-3-2. 자식 폴더의 자식 파일들의 OId 배열을 넣어준다.
          const {fileRowArr: _arr2} = await this.dbHubService.readFileRowArrByDirOId(where, directory.dirOId)
          _arr2.forEach((fileRow: T.FileRowType) => {
            directory.fileOIdsArr.push(fileRow.fileOId)
          })

          extraDirs.dirOIdsArr.push(directory.dirOId)
          extraDirs.directories[directory.dirOId] = directory
          rootDir.subDirOIdsArr.push(directory.dirOId)
        }

        // 2-4. 자식 파일들 조회 뙇!!
        const {fileRowArr} = await this.dbHubService.readFileRowArrByDirOId(where, rootDirOId)

        // 2-5. 자식 파일들 extraFileRows 및 fileOIdsArr 에 넣기
        fileRowArr.forEach((fileRow: T.FileRowType) => {
          extraFileRows.fileOIdsArr.push(fileRow.fileOId)
          extraFileRows.fileRows[fileRow.fileOId] = fileRow
          rootDir.fileOIdsArr.push(fileRow.fileOId)
        })
      } // ::
      else {
        // 3. 없을때

        // 3-1. 루트 디렉토리 생성 뙇!!
        const {directory} = await this.dbHubService.createDirRoot(where)

        // 3-2. extraDirs 에 루트 디렉토리 넣기
        rootDirOId = directory.dirOId

        extraDirs.dirOIdsArr.push(rootDirOId)
        extraDirs.directories[rootDirOId] = directory
      }

      return {rootDirOId, extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
