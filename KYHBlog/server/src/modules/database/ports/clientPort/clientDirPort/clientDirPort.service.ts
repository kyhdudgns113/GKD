import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'
import {FILE_NAME_MAX_LENGTH} from '@values'

@Injectable()
export class ClientDirPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // POST AREA:

  /**
   * addDirectory
   *
   *  - data.parentDirOId 디렉토리에 data.dirName 이라는 디렉토리를 추가한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *      1. 이름 길이 체크
   *      2. 이름이 root 가 아니어야 한다.
   *      3. 부모 디렉토리가 들어와야 한다.
   *  3. 디렉토리 추가 뙇!!
   *  4. 부모 디렉토리 정보 뙇!!
   *  5. 부모 디렉토리 정보 extraDirs 및 extraFileRows 에 뙇!!
   *  6. 자기 정보 extraDirs 에 뙇!!
   */
  async addDirectory(jwtPayload: T.JwtPayloadType, data: HTTP.AddDirectoryType) {
    const where = `/client/directory/addDirectory`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 입력값 췍!!
      const {parentDirOId, dirName} = data

      // 2-1. 이름 길이 체크
      if (!dirName || dirName.trim().length === 0 || dirName.length > 20) {
        throw {
          gkd: {dirName: `디렉토리 이름은 비어있거나 20자 이상이면 안됨`},
          gkdErrCode: 'CLIENTDIRPORT_addDirectory_InvalidDirNameLength',
          gkdErrMsg: `디렉토리 이름은 비어있거나 20자 이상이면 안됨`,
          gkdStatus: {dirName, parentDirOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-2. 이름이 root 가 아니어야 한다.
      if (dirName === 'root') {
        throw {
          gkd: {dirName: `루트 디렉토리는 자동 생성만 가능합니다`},
          gkdErrCode: 'CLIENTDIRPORT_addDirectory_InvalidDirName',
          gkdErrMsg: `그 이름으로는 만들지 못합니다.`,
          gkdStatus: {dirName, parentDirOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-3. 부모 디렉토리가 들어와야 한다.
      if (!parentDirOId) {
        throw {
          gkd: {parentDirOId: `부모 디렉토리 오브젝트 아이디가 없음`},
          gkdErrCode: 'CLIENTDIRPORT_addDirectory_InvalidParentDirOId',
          gkdErrMsg: `부모 디렉토리값이 들어와야 합니다.`,
          gkdStatus: {parentDirOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      const dto: DTO.CreateDirDTO = {parentDirOId, dirName}

      // 3. 디렉토리 추가 뙇!! (여기서 부모 디렉토리의 배열길이 수정도 이루어진다)
      const {directory: newDir} = await this.dbHubService.createDir(where, dto)

      // 4. 부모 디렉토리 정보 뙇!!
      const {directory: parentDir, fileRowArr} = await this.dbHubService.readDirByDirOId(where, parentDirOId)

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      // 5. 부모 디렉토리 정보 extraDirs 및 extraFileRows 에 뙇!!
      U.pushExtraDirs_Single(where, extraDirs, parentDir)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      // 6. 자기 정보 extraDirs 에 뙇!!
      U.pushExtraDirs_Single(where, extraDirs, newDir)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * addFile
   *  - data.dirOId 디렉토리에 data.fileName 이라는 파일을 추가한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *  3. 파일 추가 뙇!!
   *  4. 부모 디렉토리 정보 뙇!!
   *  5. 부모 디렉토리 정보 extraDirs 및 extraFileRows 에 뙇!!
   */
  async addFile(jwtPayload: T.JwtPayloadType, data: HTTP.AddFileType) {
    const where = `/client/directory/addFile`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)
      const {userName, userOId} = jwtPayload

      // 2. 입력값 췍!!
      const {dirOId, fileName} = data

      // 2-1. dirOId 체크
      if (!dirOId) {
        throw {
          gkd: {dirOId: `디렉토리 오브젝트 아이디가 없음`},
          gkdErrCode: 'CLIENTDIRPORT_addFile_InvalidDirOId',
          gkdErrMsg: `디렉토리 오브젝트 아이디가 없음`,
          gkdStatus: {dirOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-2. fileName 길이 체크
      if (!fileName || fileName.trim().length === 0 || fileName.length > FILE_NAME_MAX_LENGTH) {
        throw {
          gkd: {fileName: `파일 이름은 비어있거나 ${FILE_NAME_MAX_LENGTH}자 이상이면 안됨`},
          gkdErrCode: 'CLIENTDIRPORT_addFile_InvalidFileName',
          gkdErrMsg: `파일 이름은 비어있거나 ${FILE_NAME_MAX_LENGTH}자 이상이면 안됨`,
          gkdStatus: {dirOId, fileName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      const dto: DTO.CreateFileDTO = {dirOId, fileName, userName, userOId}

      // 3. 파일 추가 뙇!!
      await this.dbHubService.createFile(where, dto)

      // 4. 부모 디렉토리 정보 뙇!!
      const {directory: parentDir, fileRowArr} = await this.dbHubService.readDirByDirOId(where, dirOId)

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      // 5. 부모 디렉토리 정보 extraDirs 및 extraFileRows 에 뙇!!
      U.pushExtraDirs_Single(where, extraDirs, parentDir)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // PUT AREA:

  /**
   * changeDirName
   *  - dirOId 디렉토리의 이름을 dirName 으로 변경한다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *  3. 디렉토리 이름 변경 뙇!!
   *  4. 자기 정보 extraDirs 에 넣기 뙇!!
   *
   * ------
   *
   * 리턴
   *
   *  - extraDirs: 변경된 디렉토리 정보가 들어간다.
   *  - extraFileRows: 변경된 디렉토리의 파일행 정보가 들어간다.
   */
  async changeDirName(jwtPayload: T.JwtPayloadType, data: HTTP.ChangeDirNameType) {
    const where = `/client/directory/changeDirName`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 입력값 췍!!
      const {dirOId, dirName} = data

      if (!dirName || dirName.trim().length === 0 || dirName.length > 32) {
        throw {
          gkd: {dirName: `디렉토리 이름은 비어있거나 32자 이상이면 안됨`},
          gkdErrCode: 'CLIENTDIRPORT_changeDirName_InvalidDirName',
          gkdErrMsg: `디렉토리 이름은 비어있거나 32자 이상이면 안됨`,
          gkdStatus: {dirOId, dirName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 3. 디렉토리 이름 변경 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.updateDirName(where, dirOId, dirName)

      // 4. 자기 정보 extraDirs 에 넣기 뙇!!
      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * changeFileName
   *  - fileOId 파일의 이름을 fileName 으로 변경한다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *  3. 파일 이름 변경 뙇!!
   *  4. 자기 정보 extraFileRows 에 넣기 뙇!!
   *
   */
  async changeFileName(jwtPayload: T.JwtPayloadType, data: HTTP.ChangeFileNameType) {
    const where = `/client/directory/changeFileName`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 입력값 췍!!
      const {fileOId, fileName} = data

      if (!fileName || fileName.trim().length === 0 || fileName.length > FILE_NAME_MAX_LENGTH) {
        throw {
          gkd: {fileName: `파일 이름은 비어있거나 ${FILE_NAME_MAX_LENGTH}자 이상이면 안됨`},
          gkdErrCode: 'CLIENTDIRPORT_changeFileName_InvalidFileName',
          gkdErrMsg: `파일 이름은 비어있거나 ${FILE_NAME_MAX_LENGTH}자 이상이면 안됨`,
          gkdStatus: {fileOId, fileName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 3. 파일 이름 변경 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.updateFileName(where, fileOId, fileName)

      // 4. 자기 정보 extraFileRows 에 넣기 뙇!!
      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * moveDirectory
   *   - moveDirOId 폴더가 이동하며, 반영해야할 결과값을 받아와서 DB 를 수정한다.
   *   - oldParentDirOId 와 newParentDirOId 폴더의 자식폴더 배열을 바꾼다.
   *
   * ------
   *
   * 코드 내용
   *
   *   1. 권한 췍!!
   *   2. 자손 폴더로 이동하는건 아닌지 췍!!
   *   3. 같은 폴더 내에서 이동시
   *     3-1. newParentDirOId 의 자식 폴더배열 업데이트 뙇!!
   *     3-2. 새로운 부모폴더와 자식폴더의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
   *   4. 다른 폴더로 이동시
   *     4-1. oldParentDirOId 의 자식 폴더배열 업데이트 뙇!!
   *     4-2. newParentDirOId 의 자식 폴더배열 업데이트 뙇!!
   *     4-3. 두 폴더와 자식 폴더들의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
   *   5. 결과값 반환 뙇!!
   *
   * 리턴
   *
   *   - extraDirs: 기존 부모폴더, 새로운 부모폴더 순서대로 DirectoryType 정보가 들어간다
   *   - extraFileRows: 기존 부모폴더, 새로운 부모폴더 순서대로 FileRowsType 정보가 들어온다.
   */
  async moveDirectory(jwtPayload: T.JwtPayloadType, data: HTTP.MoveDirectoryType) {
    const where = `/client/directory/moveDirectory`

    const {oldParentDirOId, newParentDirOId, moveDirOId, oldParentChildArr, newParentChildArr} = data
    try {
      // 1. 권한 췍!!
      // 2. 자손 폴더로 이동하는건 아닌지 췍!!
      await Promise.all([
        this.dbHubService.checkAuthAdmin(where, jwtPayload),
        this.dbHubService
          .isAncestor(where, moveDirOId, newParentDirOId)
          .then(isAncestor => {
            if (isAncestor) {
              throw {
                gkd: {moveDirOId: `자손 폴더로 이동할 수 없음`},
                gkdErrCode: 'CLIENTDIRPORT_moveDirectory_InvalidMoveDirOId',
                gkdErrMsg: `자손 폴더로 이동할 수 없음`,
                gkdStatus: {moveDirOId, newParentDirOId},
                statusCode: 400,
                where
              } as T.ErrorObjType
            }
          })
          .catch(errObj => {
            throw errObj
          })
      ])

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      // 3, 4. 같은 폴더 내에서 이동하는지, 다른 폴더로 이동하는지 확인
      if (oldParentDirOId === newParentDirOId) {
        // 3. 같은 폴더 내에서 이동시

        // 3-1. newParentDirOId 의 자식 폴더배열 업데이트 뙇!!
        const {directoryArr, fileRowArr} = await this.dbHubService.updateDirArr_Dir(where, newParentDirOId, newParentChildArr)

        // 3-2. 새로운 부모폴더와 자식폴더의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
        U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)
      } // ::
      else {
        // 4. 다른 폴더로 이동시

        // 4-1. oldParentDirOId 의 자식 폴더배열 업데이트 뙇!!
        // 4-2. newParentDirOId 의 자식 폴더배열 업데이트 뙇!!
        const [{directoryArr: _oDirArr, fileRowArr: _oFileRowArr}, {directoryArr: _nDirArr, fileRowArr: _nFileRowArr}] = await Promise.all([
          this.dbHubService.updateDirArr_Dir(where, oldParentDirOId, oldParentChildArr),
          this.dbHubService.updateDirArr_Dir(where, newParentDirOId, newParentChildArr)
        ])

        // 4-3. 두 폴더와 자식 폴더들의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
        U.pushExtraDirs_Arr(where, extraDirs, _oDirArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, _oFileRowArr)
        U.pushExtraDirs_Arr(where, extraDirs, _nDirArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, _nFileRowArr)
      }

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * moveFile
   *   - moveFileOId 파일이 이동하며, 반영해야할 결과값을 받아와서 DB 를 수정한다.
   *   - oldParentDirOId 와 newParentDirOId 폴더의 자식폴더 배열을 바꾼다.
   *
   * ------
   *
   * 코드 내용
   *
   *   1. 권한 췍!!
   *   2. 같은 폴더 내에서 이동시
   *     2-1. newParentDirOId 의 자식 파일 배열 업데이트 뙇!!
   *     2-2. 새로운 부모폴더의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
   *       - 자식폴더의 정보는 전달하지 않는다.
   *       - 변경되지도 않았고, 이미 있을수도 있으며, 당장에 필요하지 않을수도 있다.
   *       - 그런 정보를 일일히 읽어오는건 낭비이다.
   *   3. 다른 폴더로 이동시
   *     3-1. oldParentDirOId 의 자식 파일 배열 업데이트 뙇!!
   *     3-2. newParentDirOId 의 자식 파일 배열 업데이트 뙇!!
   *     3-3. 두 폴더의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
   *       - 자식폴더의 정보는 전달하지 않는다.
   *       - 변경되지도 않았고, 이미 있을수도 있으며, 당장에 필요하지 않을수도 있다.
   *       - 그런 정보를 일일히 읽어오는건 낭비이다.
   *   4. 결과값 반환 뙇!!
   *
   * 리턴
   *
   *   - extraDirs: 기존 부모폴더, 새로운 부모폴더 순서대로 DirectoryType 정보가 들어간다
   *   - extraFileRows: 기존 부모폴더, 새로운 부모폴더 순서대로 FileRowsType 정보가 들어온다.
   */
  async moveFile(jwtPayload: T.JwtPayloadType, data: HTTP.MoveFileType) {
    const where = `/client/directory/moveFile`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      const {oldParentDirOId, newParentDirOId, oldParentChildArr, newParentChildArr} = data

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      // 2. 같은 폴더 내에서 이동시
      if (oldParentDirOId === newParentDirOId) {
        // 2-1. newParentDirOId 의 자식 파일 배열 업데이트 뙇!!
        const {directoryArr, fileRowArr} = await this.dbHubService.updateDirArr_File(where, newParentDirOId, newParentChildArr)

        // 2-2. 새로운 부모폴더와 자식폴더의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
        U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)
      } // ::
      else {
        // 3. 다른 폴더로 이동시

        // 3-1. oldParentDirOId 의 자식 파일 배열 업데이트 뙇!!
        // 3-2. newParentDirOId 의 자식 파일 배열 업데이트 뙇!!
        const [{directoryArr: _oDirArr, fileRowArr: _oFileRowArr}, {directoryArr: _nDirArr, fileRowArr: _nFileRowArr}] = await Promise.all([
          this.dbHubService.updateDirArr_File(where, oldParentDirOId, oldParentChildArr),
          this.dbHubService.updateDirArr_File(where, newParentDirOId, newParentChildArr)
        ])

        // 3-3. 두 폴더와 자식 폴더들의 Directory, FileRow 정보를 ExtraObjects 에 삽입 뙇!!
        U.pushExtraDirs_Arr(where, extraDirs, _oDirArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, _oFileRowArr)
        U.pushExtraDirs_Arr(where, extraDirs, _nDirArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, _nFileRowArr)
      }

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // GET AREA:

  /**
   * loadDirectory
   *  - dirOId 디렉토리와 그 자식파일행의 정보를 읽어온다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 디렉토리 조회 뙇!!
   *  2. 자기 정보 extraDirs 에 삽입 뙇!!
   *  3. 자식 파일행들 extraFileRows 및 fileOIdsArr 에 삽입 뙇!!
   *
   * ------
   *
   * 리턴
   *
   *  - extraDirs: dirOId 디렉토리만 들어간다
   *  - extraFileRows: dirOId 디렉토리의 파일행만 들어간다.
   */
  async loadDirectory(dirOId: string) {
    const where = `/client/directory/loadDirectory`

    try {
      // 1. 디렉토리 조회 뙇!!
      const {directory, fileRowArr} = await this.dbHubService.readDirByDirOId(where, dirOId)

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      if (!directory) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리`},
          gkdErrCode: 'CLIENTDIRPORT_loadDirectory_InvalidDirOId',
          gkdErrMsg: `존재하지 않는 디렉토리`,
          gkdStatus: {dirOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2. 자기 정보 extraDirs 에 삽입 뙇!!
      U.pushExtraDirs_Single(where, extraDirs, directory)

      // 3. 자식 파일행들 extraFileRows 및 fileOIdsArr 에 삽입 뙇!!
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

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

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      if (directory) {
        // 2. 존재할때
        rootDirOId = directory.dirOId

        // 2-1. extraDirs 와 extraFileRows 에 정보 삽입 뙇!!
        U.pushExtraDirs_Single(where, extraDirs, directory)
        U.pushExtraFileRows_Arr(where, extraFileRows, _rootsFileRowArr)

        // 2-3. 자식 디렉토리 배열 및 그들의 자식파일행 배열 조회 뙇!!
        const {directoryArr, fileRowArr} = await this.dbHubService.readDirArrByParentDirOId(where, rootDirOId)

        // 2-4. 그 정보들 extraDirs 및 extraFileRows 에 삽입 뙇!!
        U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
        U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)
      } // ::
      else {
        // 3. 없을때

        // 3-1. 루트 디렉토리 생성 뙇!!
        const {directory} = await this.dbHubService.createDirRoot(where)
        rootDirOId = directory.dirOId

        // 3-2. extraDirs 에 루트 디렉토리 삽입 뙇!!
        U.pushExtraDirs_Single(where, extraDirs, directory)
      }

      return {rootDirOId, extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // DELETE AREA:

  /**
   * deleteDirectory
   *  - dirOId 디렉토리를 삭제한다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 디렉토리 삭제 뙇!!
   *  3. 부모 폴더의 정보를 extraDirs 에 삽입 뙇!!
   *
   * ------
   *
   * 리턴
   *
   *  - extraDirs: 삭제된 디렉토리의 부모폴더 정보
   *  - extraFileRows: empty
   */
  async deleteDirectory(jwtPayload: T.JwtPayloadType, dirOId: string) {
    const where = `/client/directory/deleteDirectory`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 디렉토리 삭제 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.deleteDir(where, dirOId)

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * deleteFile
   *  - fileOId 파일을 삭제한다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 파일 삭제 뙇!!
   *  3. 부모 폴더의 정보를 extraDirs 에 삽입 뙇!!
   *
   * ------
   *
   * 리턴
   *
   *  - extraDirs: 삭제된 파일의 부모폴더 정보
   *  - extraFileRows: empty
   */
  async deleteFile(jwtPayload: T.JwtPayloadType, fileOId: string) {
    const where = `/client/directory/deleteFile`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 파일 삭제 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.deleteFile(where, fileOId)

      const extraDirs: T.ExtraDirObjectType = V.NULL_extraDirs()
      const extraFileRows: T.ExtraFileRowObjectType = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA6: private functions
}
