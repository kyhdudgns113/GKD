import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {DirectoryType} from '@common/types'
import {generateObjectId} from '@utils'

import * as DTO from '@dtos'

@Injectable()
export class DirectoryDBService {
  constructor(private readonly dbService: DBService) {}

  async createDir(where: string, dto: DTO.CreateDirDTO) {
    /**
     * 1. dirOId 생성 (미중복 나올때까지 반복)
     * 2. 부모 디렉토리의 자식 폴더 갯수 받아오기(루트 아닐때만)
     * 3. 디렉토리 생성
     * 4. 부모 디렉토리의 subDirArrLen 증가
     * 5. 디렉토리 타입으로 변환 및 리턴
     */
    try {
      // 1. dirOId 생성 (미중복 나올때까지 반복)
      let dirOId = generateObjectId()
      try {
        while (true) {
          const {directory} = await this.readDirByDirOId(where, dirOId)
          if (directory) {
            dirOId = generateObjectId()
          } // ::
          else {
            break
          }
        }
        // ::
      } catch (errObj) {
        // ::
        throw errObj
      }

      const {dirName, parentDirOId} = dto
      let dirIdx = 0

      // 2. 부모 디렉토리의 자식 폴더 갯수 받아오기(루트 아닐때만)
      if (parentDirOId !== 'NULL') {
        const queryParent = `SELECT subDirArrLen FROM directories WHERE dirOId = ?`
        const paramsParent = [parentDirOId]
        const [resultParent] = await this.dbService.getConnection().execute(queryParent, paramsParent)

        const resultArrParent = resultParent as RowDataPacket[]

        const {subDirArrLen} = resultArrParent[0]

        dirIdx = subDirArrLen
      }

      // 3. 디렉토리 생성
      const query = `INSERT INTO directories (dirOId, dirName, dirIdx, parentDirOId) VALUES (?, ?, ?, ?)`
      const params = [dirOId, dirName, dirIdx, parentDirOId]
      await this.dbService.getConnection().execute(query, params)

      // 4. 부모 디렉토리의 subDirArrLen 증가
      const queryParentUpdate = `UPDATE directories SET subDirArrLen = subDirArrLen + 1 WHERE dirOId = ?`
      const paramsParentUpdate = [parentDirOId]
      await this.dbService.getConnection().execute(queryParentUpdate, paramsParentUpdate)

      // 5. 디렉토리 타입으로 변환 및 리턴
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createDirRoot(where: string) {
    try {
      const dto: DTO.CreateDirDTO = {dirName: 'root', parentDirOId: 'NULL'}

      const {directory} = await this.createDir(where, dto)

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readDirArrByParentDirOId(where: string, parentDirOId: string) {
    /**
     * parentDirOId 가 부모인 디렉토리들의 배열을 리턴한다.
     * - 정렬은 dirIdx 기준으로 한다.
     */
    try {
      const query = `SELECT * FROM directories WHERE parentDirOId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [parentDirOId])

      const resultArr = result as RowDataPacket[]

      resultArr.sort((a, b) => a.dirIdx - b.dirIdx)

      const directoryArr: DirectoryType[] = resultArr.map(row => {
        const {dirName, dirOId, parentDirOId} = row

        const directory: DirectoryType = {dirName, dirOId, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

        return directory
      })

      return {directoryArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirByDirOId(where: string, dirOId: string) {
    try {
      const query = `SELECT * FROM directories WHERE dirOId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [dirOId])

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null}
      }

      if (resultArr.length > 1) {
        throw {
          gkd: {dirOId: `하나의 dirOId에 대해 2개 이상의 디렉토리가 존재합니다.`},
          gkdErrMsg: `dirOId 중복 오류`,
          gkdStatus: {dirOId},
          statusCode: 500,
          where
        }
      }

      const {dirName, parentDirOId} = resultArr[0]

      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirRoot(where: string) {
    try {
      const query = `SELECT * FROM directories WHERE dirName = 'root'`
      const [result] = await this.dbService.getConnection().execute(query)

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null}
      }

      const {dirOId, dirName, parentDirOId} = resultArr[0]

      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
