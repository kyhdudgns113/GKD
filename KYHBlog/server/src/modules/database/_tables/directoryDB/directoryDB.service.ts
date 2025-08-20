import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {DirectoryType} from '@shareTypes'
import {generateObjectId} from '@utils'

import * as DTO from '@dtos'
import * as T from '@common/types'

@Injectable()
export class DirectoryDBService {
  constructor(private readonly dbService: DBService) {}

  async createDir(where: string, dto: DTO.CreateDirDTO) {
    where = where + '/createDir'
    /**
     * 1. dirOId 생성 (미중복 나올때까지 반복)
     * 2. 부모 디렉토리의 자식 폴더 갯수 받아오기(루트 아닐때만)
     * 3. 디렉토리 생성
     * 4. 부모 디렉토리의 subDirArrLen 증가
     * 5. 디렉토리 타입으로 변환 및 리턴
     */
    const {dirName, parentDirOId} = dto

    try {
      // 1. dirOId 생성 (미중복 나올때까지 반복)
      let dirOId = generateObjectId()
      try {
        while (true) {
          const query = `SELECT dirName FROM directories WHERE dirOId = ?`
          const [result] = await this.dbService.getConnection().execute(query, [dirOId])
          const resultArr = result as RowDataPacket[]
          if (resultArr.length === 0) break

          dirOId = generateObjectId()
        }
        // ::
      } catch (errObj) {
        // ::
        throw errObj
      }

      let dirIdx = 0

      // 2. 부모 디렉토리의 자식 폴더 갯수 받아오기(루트 아닐때만)
      if (parentDirOId !== 'NULL') {
        const queryParent = `SELECT subDirArrLen FROM directories WHERE dirOId = ?`
        const paramsParent = [parentDirOId]
        const [resultParent] = await this.dbService.getConnection().execute(queryParent, paramsParent)

        const resultArrParent = resultParent as RowDataPacket[]

        // 2-1. 부모 디렉토리 존재 체크
        if (resultArrParent.length === 0) {
          throw {
            gkd: {parentDirOId: `존재하지 않는 디렉토리`},
            gkdErrCode: 'DIRECTORYDB_createDir_InvalidParentDirOId',
            gkdErrMsg: `존재하지 않는 디렉토리`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }

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
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `자식 폴더의 이름은 겹치면 안됨`, message: errObj.message},
            gkdErrCode: 'DIRECTORYDB_createDir_DuplicateDirName',
            gkdErrMsg: `자식 폴더의 이름은 겹치면 안됨`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where
          } as T.ErrorObjType
        } // ::
        else {
          errObj.statusCode = 500
        }
      }
      throw errObj
    }
  }
  async createDirRoot(where: string) {
    where = where + '/createDirRoot'
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
      // 1. 자식 디렉토리들 정보 조회
      const queryDirs = `
        SELECT dirOId, dirName, parentDirOId, dirIdx
        FROM directories
        WHERE parentDirOId = ?
        ORDER BY dirIdx
      `
      const [dirs] = await this.dbService.getConnection().execute(queryDirs, [parentDirOId])
      const dirArr = dirs as RowDataPacket[]

      if (dirArr.length === 0) return {directoryArr: [], fileRowArr: []}

      const dirOIds = dirArr.map(d => d.dirOId)

      // 2. 모든 자식 폴더들의 자식 파일들 조회
      const queryFiles = `
        SELECT dirOId, fileOId, fileName, fileStatus, fileIdx
        FROM files
        WHERE dirOId IN (?)
        ORDER BY fileIdx
      `
      const [files] = await this.dbService.getConnection().query(queryFiles, [dirOIds])
      const fileArr = files as RowDataPacket[]

      // 3. dirOId 별로 파일정보 그룹핑
      const fileMap = new Map<string, T.FileRowType[]>()
      fileArr.forEach(row => {
        const {dirOId, fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        if (!fileMap.has(dirOId)) fileMap.set(dirOId, [])
        fileMap.get(dirOId).push(fileRow)
      })

      // 4. 모든 자식 폴더들의 자식 폴더들 조회
      const querySubDirs = `
        SELECT parentDirOId, dirOId
        FROM directories
        WHERE parentDirOId IN (?)
        ORDER BY dirIdx
      `
      const [subDirs] = await this.dbService.getConnection().query(querySubDirs, [dirOIds])
      const subDirArr = subDirs as RowDataPacket[]

      // 5. dirOId 별로 자식 폴더들의 OId 그룹핑핑
      const subDirMap = new Map<string, string[]>()
      subDirArr.forEach(row => {
        if (!subDirMap.has(row.parentDirOId)) subDirMap.set(row.parentDirOId, [])
        subDirMap.get(row.parentDirOId).push(row.dirOId)
      })

      // 6. 리턴할 정보들 생성
      const directoryArr: DirectoryType[] = []
      const fileRowArr: T.FileRowType[] = []

      dirArr.forEach(d => {
        const {dirOId, dirName, parentDirOId} = d
        const fileRows = fileMap.get(dirOId) || []
        const fileOIdsArr = fileRows.map(f => f.fileOId)
        fileRowArr.push(...fileRows)

        const subDirOIdsArr = subDirMap.get(dirOId) || []

        const directory: DirectoryType = {
          dirName,
          dirOId,
          parentDirOId,
          fileOIdsArr,
          subDirOIdsArr
        }
        directoryArr.push(directory)
      })

      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirByDirOId(where: string, dirOId: string) {
    where = where + '/readDirByDirOId'
    /**
     * dirOId 에 해당하는 디렉토리를 정보를 리턴한다
     * 해당 디렉토리의 자식파일 행들의 배열도 리턴한다
     *   - fileOIdsArr 값 얻기 위해서라도 파일 조회하는 쿼리를 쓴다
     *   - 어차피 쿼리 쓸거라면 파일 행 정보도 구해줘서 리턴해주자
     *   - 역할이 하나 추가되서 좀 애매하긴 하다 ㅠㅠ
     *
     * 1. 디렉토리 조회 뙇!!
     * 2. 자식 파일들
     *   2-1. 자식 파일들 조회 뙇!!
     *   2-2. 자식 파일들 OID 배열 뙇!!
     *   2-3. 자식 파일들의 행 배열 뙇!!
     * 3. 자식 폴더들
     *   3-1. 자식 폴더들 조회 뙇!!
     *   3-2. 자식 폴더들 OID 배열 뙇!!
     * 4. 디렉토리 타입으로 변환 및 리턴
     */
    try {
      // 1. 디렉토리 조회 뙇!!
      const query = `SELECT * FROM directories WHERE dirOId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [dirOId])

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null}
      }

      const {dirName, parentDirOId} = resultArr[0]

      // 2-1. 자식 파일들 조회 뙇!!
      const queryFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const [resultFile] = await this.dbService.getConnection().execute(queryFile, [dirOId])

      const resultArrFile = resultFile as RowDataPacket[]

      // 2-2. 자식 파일들 OID 배열 뙇!!
      const fileOIdsArr: string[] = resultArrFile.map(row => row.fileOId)

      // 2-3. 자식 파일들의 행 배열 뙇!!
      const fileRowArr: T.FileRowType[] = resultArrFile.map(row => {
        const {fileName, fileOId, fileStatus} = row
        const fileRow: T.FileRowType = {
          dirOId,
          fileName,
          fileOId,
          fileStatus
        }
        return fileRow
      })

      // 3-1. 자식 폴더들 조회 뙇!!
      const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const [resultSubDir] = await this.dbService.getConnection().execute(querySubDir, [dirOId])

      const resultArrSubDir = resultSubDir as RowDataPacket[]

      // 3-2. 자식 폴더들 OID 배열 뙇!!
      const subDirOIdsArr: string[] = resultArrSubDir.map(row => row.dirOId)

      // 4. 디렉토리 타입으로 변환 및 리턴
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirRoot(where: string) {
    /**
     * 루트 폴더의 정보와 자식파일들의 행정보 배열을 리턴한다.
     * - 어차피 fileOIdsArr 구할때 파일 조회하는 쿼리를 실행한다.
     * - 이왕 쿼리 실행하는거 파일행 배열 정보도 리턴한다.
     *
     */
    try {
      const query = `SELECT * FROM directories WHERE dirName = 'root'`
      const [result] = await this.dbService.getConnection().execute(query)

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null, fileRowArr: []}
      }

      const {dirOId, dirName, parentDirOId} = resultArr[0]

      // 1. 루트 폴더의 자식 파일들 조회 뙇!!
      const queryFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const [resultFile] = await this.dbService.getConnection().execute(queryFile, [dirOId])
      const resultArrFile = resultFile as RowDataPacket[]

      // 2. 자식 파일들의 OId 배열 및 행 배열 생성
      const fileOIdsArr: string[] = []
      const fileRowArr: T.FileRowType[] = []

      resultArrFile.forEach(row => {
        const {fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        fileRowArr.push(fileRow)
        fileOIdsArr.push(fileOId)
      })

      // 3. 루트 폴더의 자식 폴더들 조회 뙇!!
      const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const [resultSubDir] = await this.dbService.getConnection().execute(querySubDir, [dirOId])
      const resultArrSubDir = resultSubDir as RowDataPacket[]
      const subDirOIdsArr: string[] = resultArrSubDir.map(row => row.dirOId)

      // 3. 디렉토리 타입으로 변환 및 리턴
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
