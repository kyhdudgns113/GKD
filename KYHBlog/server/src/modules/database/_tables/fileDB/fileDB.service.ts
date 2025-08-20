import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {FileRowType, FileType} from '@common/types'

import * as T from '@common/types'
import * as DTO from '@dtos'
import {generateObjectId} from '@common/utils'

@Injectable()
export class FileDBService {
  constructor(private readonly dbService: DBService) {}

  async createFile(where: string, dto: DTO.CreateFileDTO) {
    where = where + '/createFile'
    const {dirOId, fileName, userName, userOId} = dto

    /**
     * dirOId 에 fileName 이름의 파일 추가
     *
     * 1. fileOId 생성 (미중복 나올때까지 반복)
     * 2. 부모 디렉토리의 파일 갯수 받아오기
     * 3. 부모 디렉토리의 파일 갯수 증가
     * 4. 파일 추가
     * 5. 파일 타입으로 변환 및 리턴
     */
    try {
      // 1. fileOId 생성 (미중복 나올때까지 반복)
      let fileOId = generateObjectId()
      try {
        while (true) {
          const query = `SELECT fileOId FROM files WHERE fileOId = ?`
          const [result] = await this.dbService.getConnection().execute(query, [fileOId])
          const resultArr = result as RowDataPacket[]

          if (resultArr.length === 0) break

          fileOId = generateObjectId()
        }
        // ::
      } catch (errObj) {
        // ::
        throw errObj
      }

      let fileIdx = 0

      // 2. 부모 디렉토리의 파일 갯수 받아오기
      const queryLen = `SELECT fileArrLen FROM directories WHERE dirOId = ?`
      const [result] = await this.dbService.getConnection().execute(queryLen, [dirOId])

      const resultArr = result as RowDataPacket[]

      // 2-1. 부모 디렉토리 존재 체크
      if (resultArr.length === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리`},
          gkdErrCode: 'FILEDB_createFile_InvalidDirOId',
          gkdErrMsg: `존재하지 않는 디렉토리`,
          gkdStatus: {dirOId, fileName},
          statusCode: 400,
          where
        } as T.ErrorObjType // ::
      }

      const {fileArrLen} = resultArr[0]

      fileIdx = fileArrLen

      // 3. 부모 디렉토리의 파일 갯수 증가
      const queryUpdate = `UPDATE directories SET fileArrLen = fileArrLen + 1 WHERE dirOId = ?`
      const paramsUpdate = [dirOId]
      await this.dbService.getConnection().execute(queryUpdate, paramsUpdate)

      // 4. 파일 추가
      const query = `INSERT INTO files (fileOId, fileName, dirOId, fileIdx, fileStatus, userName, userOId) VALUES (?, ?, ?, ?, ?, ?, ?)`
      const params = [fileOId, fileName, dirOId, fileIdx, 0, userName, userOId]
      await this.dbService.getConnection().execute(query, params)

      // 5. 파일 타입으로 변환 및 리턴
      const file: FileType = {
        fileOId,
        fileName,
        dirOId,
        fileIdx,
        fileStatus: 0,
        userName,
        userOId,
        content: ''
      }

      return {file}
      // ::
    } catch (errObj) {
      // ::
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `파일 이름이 겹침`, message: errObj.message},
            gkdErrCode: 'FILEDB_createFile_DuplicateFileName',
            gkdErrMsg: `파일 이름이 겹침`,
            gkdStatus: {dirOId, fileName},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }
      }
      throw errObj
    }
  }

  async readFileRowArrByDirOId(where: string, dirOId: string) {
    try {
      const query = `SELECT * FROM files WHERE dirOId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [dirOId])

      const resultArr = result as RowDataPacket[]

      resultArr.sort((a, b) => a.fileIdx - b.fileIdx)

      const fileRowArr: FileRowType[] = resultArr.map(row => {
        const {fileOId, fileName, dirOId, fileStatus} = row

        const fileRow: FileRowType = {fileOId, fileName, dirOId, fileStatus}

        return fileRow
      })

      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
