import {Injectable} from '@nestjs/common'

import {DatabaseHubService} from '../../databaseHub'
import {AUTH_ADMIN, AUTH_USER, gkdSaltOrRounds, adminUserId} from '@secret'
import {GKDLockService} from '@modules/gkdLock'

import * as bcrypt from 'bcrypt'
import * as T from '@common/types'
import * as HTTP from '@common/types/httpDataTypes'

/**
 * 권한체크는 여기서 한다
 *  - dbHubService 의 권한체크 함수를 호출한다.
 *
 * JWT 는 여기서 만들지 않는다.
 *  - 나중에 요청 받는 모듈, port 모듈을 분리할 수 있다.
 *  - 그렇게 되면 jwt 모듈이랑 요청받는 모듈을 하나의 서비스로 두는게 합리적이다.
 *  - port 모듈에서는 jwt 모듈에 접근할 수 없는 상태가 될 것이다.
 */
@Injectable()
export class ClientPortService {
  constructor(
    private readonly dbHubService: DatabaseHubService,
    private readonly lockService: GKDLockService
  ) {}

  // AREA1: ClientAuth_토큰 필요 없는 함수들
  async logIn(userId: string, password: string) {
    const where = '/client/auth/logIn'
    try {
      // 유저 아이디 길이 췍!!
      if (userId.length < 6 || userId.length > 20) {
        throw {gkd: {userId: `아이디는 6자 이상 16자 이하로 입력해주세요.`}, gkdErr: '로그인 아이디 길이 에러', gkdStatus: {userId}, where}
      }

      // 비밀번호 길이 췍!!
      if (password.length < 8 || password.length > 20) {
        throw {gkd: {password: `비밀번호는 8자 이상 20자 이하로 입력해주세요.`}, gkdErr: '로그인 비밀번호 길이 에러', gkdStatus: {userId}, where}
      }

      // 비밀번호 형식 췍!!
      if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {
          gkd: {password: `비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상으로 입력해주세요.`},
          gkdErr: '로그인 비밀번호 형식 에러',
          gkdStatus: {userId},
          where
        }
      }

      // 리턴용 user 뙇!!
      const {user} = await this.dbHubService.readUserByUserIdAndPassword(where, userId, password)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async signUp(userId: string, userName: string, password: string) {
    const where = '/client/auth/signUp'
    try {
      // 유저 아이디 길이 췍!!
      if (userId.length < 6 || userId.length > 20) {
        throw {gkd: {userId: `아이디는 6자 이상 16자 이하로 입력해주세요.`}, gkdErr: '', gkdStatus: {userId, userName}, where}
      }

      // 유저 이름 길이 췍!!
      if (userName.length < 2 || userName.length > 12) {
        throw {gkd: {userName: `이름은 2자 이상 12자 이하로 입력해주세요.`}, gkdErr: '', gkdStatus: {userId, userName}, where}
      }

      // 유저 아이디 중복 췍!!
      const {user: _isIdExist} = await this.dbHubService.readUserByUserId(where, userId)
      if (_isIdExist) {
        throw {gkd: {userId: `이미 존재하는 아이디입니다.`}, gkdErr: '', gkdStatus: {userId, userName}, where}
      }

      // 유저 이름 중복 췍!!
      const {user: _isNameExist} = await this.dbHubService.readUserByUserName(where, userName)
      if (_isNameExist) {
        throw {gkd: {userName: `이미 존재하는 이름입니다.`}, gkdErr: '', gkdStatus: {userId, userName}, where}
      }

      // 비밀번호 길이 췍!!
      if (password.length < 8 || password.length > 20) {
        throw {gkd: {password: `비밀번호는 8자 이상 20자 이하로 입력해주세요.`}, gkdErr: '', gkdStatus: {userId, userName}, where}
      }

      // 비밀번호 형식 췍!!
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {
          gkd: {
            password: `비밀번호는 영문 대소문자, 숫자, 특수문자를 각각 포함하여 8자 이상으로 입력해주세요.`
          },
          gkdErr: '',
          gkdStatus: {userId, userName},
          where
        }
      }

      const hashedPassword = await bcrypt.hash(password, gkdSaltOrRounds)
      const {user} = await this.dbHubService.createUser(where, userId, userName, hashedPassword)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async signUpOrLoginGoogle(userId: string, userName: string, picture: string) {
    const where = '/client/auth/signUpOrLoginGoogle'
    try {
      const {user: _user} = await this.dbHubService.readUserByUserId(where, userId)

      // 유저가 이미 있는 경우
      if (_user) {
        // 구글 계정으로 가입한게 아닌 경우
        if (_user.signUpType !== 'google') {
          throw {
            gkd: {userId: `이 계정은 구글계정으로 가입하지 않았습니다.`},
            gkdErr: `일반 가입계정의 구글로그인 시도`,
            gkdStatus: {userId, userName},
            where
          }
        }

        const {userOId} = _user
        return {userOId}
      }

      // 유저가 없으니 구글유저를 만든다.
      const {user} = await this.dbHubService.createUserGoogle(where, userId, userName, picture)
      const {userOId} = user
      return {userOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA2: ClientAuth_토큰 필요한 함수들
  /**
   * jwtPayload 에 있는 정보로 해당 유저 데이터를 찾아서 넘겨준다.
   *  - 새로고침 효과를 주는 용도로도 사용된다.
   */
  async refreshToken(jwtPayload: T.JwtPayloadType) {
    const where = '/client/auth/refreshToken'
    try {
      const {userName, userOId} = jwtPayload
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)

      // 유저 아직 있는지 췍!!
      // 중간에 삭제했을수도 있다.
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저정보 검색 안됨.`, gkdStatus: {userName, userOId}, where}
      }

      // 리턴 뙇!!
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA3: ClientDefault_토큰 필요 없는 함수들
  async readIntroFile() {
    const where = '/client/default/readIntroFile'
    try {
      const {file} = await this.dbHubService.readFileIntroPost(where)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA4: ClientDefault_토큰 필요한 함수들

  // AREA1: ClientPosting_토큰 필요없는 함수들
  async getDirectoryInfo(dirOId: string) {
    const where = '/client/posting/getDirectoryInfo'
    try {
      // 1. 디렉토리 조회 뙇!!
      const {directory} = await this.dbHubService.readDirectoryByDirOId(where, dirOId)

      // 2. 자식들 정보: extraDirs 뙇!!
      const {subDirOIdsArr} = directory
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [dirOId],
        directories: {[dirOId]: directory}
      }
      const dirArrLen = subDirOIdsArr.length
      for (let i = 0; i < dirArrLen; i++) {
        const subDirOId = subDirOIdsArr[i]
        const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
        extraDirs.dirOIdsArr.push(subDirOId)
        extraDirs.directories[subDirOId] = directory
      }

      // 3. 파일들 정보: extraFileRows 뙇!!
      const {fileOIdsArr} = directory
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr,
        fileRows: {}
      }
      const fileArrLen = fileOIdsArr.length
      for (let i = 0; i < fileArrLen; i++) {
        const fileOId = fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        const {name, isIntroPost, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
        extraFileRows.fileRows[fileOId] = fileRow
      }

      // 4. 리턴 뙇!!
      return {extraDirs, extraFileRows}
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async getFileInfo(fileOId: string) {
    const where = '/client/posting/getFileInfo'
    try {
      // 1. 파일 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
      if (!file) {
        throw {gkd: {fileOId: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOId}, where}
      }

      // 2. 부모 폴더의 자식정보를 뙇!!
      const {parentDirOId} = file
      const {directory} = await this.dbHubService.readDirectoryByDirOId(where, parentDirOId)
      const {subDirOIdsArr, fileOIdsArr} = directory

      // 2-1. 부모의 자식 폴더들 정보: extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [parentDirOId],
        directories: {[parentDirOId]: directory}
      }
      const dirArrLen = subDirOIdsArr.length
      for (let i = 0; i < dirArrLen; i++) {
        const subDirOId = subDirOIdsArr[i]
        const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
        extraDirs.dirOIdsArr.push(subDirOId)
        extraDirs.directories[subDirOId] = directory
      }

      // 2-2. 부모의 자식 파일들 정보: extraFileRows 뙇!!
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr,
        fileRows: {}
      }
      const fileArrLen = fileOIdsArr.length
      for (let i = 0; i < fileArrLen; i++) {
        const fileOId = fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        const {name, isIntroPost, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
        extraFileRows.fileRows[fileOId] = fileRow
      }

      // 3. 리턴 뙇!!
      return {extraDirs, extraFileRows, file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async getRootDirOId() {
    const where = '/client/posting/getRootDirOId'
    try {
      // 1. 루트 디렉토리 있는지 뙇!!
      const {rootDir: _rootDir} = await this.dbHubService.readDirectoryRoot(where)
      if (_rootDir) {
        const {dirOId, fileOIdsArr, subDirOIdsArr} = _rootDir

        // 1-1. 리턴용 extraDirs 뙇!!
        const extraDirs: T.ExtraDirObjectType = {
          dirOIdsArr: [dirOId],
          directories: {[dirOId]: _rootDir}
        }
        const extraFileRows: T.ExtraFileRowObjectType = {
          fileOIdsArr,
          fileRows: {}
        }

        const dirArrLen = subDirOIdsArr.length
        for (let i = 0; i < dirArrLen; i++) {
          const subDirOId = subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 1-2. 리턴용 extraFiles 뙇!!
        const fileArrLen = fileOIdsArr.length
        for (let i = 0; i < fileArrLen; i++) {
          const fileOId = fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileRows[fileOId] = fileRow
        }

        return {extraDirs, extraFileRows, rootDirOId: _rootDir.dirOId}
      }

      // 2. 루트 디렉토리 없으니 생성 뙇!!
      const {rootDir} = await this.dbHubService.createDirectoryRoot(where)

      // 3. 리턴용 extraDirs 뙇!!
      const {dirOId} = rootDir
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [dirOId],
        directories: {[dirOId]: rootDir}
      }

      // 4. 리턴용 extraFiles 뙇!! (루트를 막 만들었으므로 비어있다.)
      const extraFileRows: T.ExtraFileRowObjectType = {fileOIdsArr: [], fileRows: {}}

      return {extraDirs, extraFileRows, rootDirOId: rootDir.dirOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA2: ClientPosting_토큰 필요한 함수들
  async addDirectory(jwtPayload: T.JwtPayloadType, data: HTTP.AddDirectoryDataType) {
    /**
     * 루트 디렉토리를 여기서도 만들 수 있게 한다.
     * - 그래야 다른 테스트를 할 때도 편리해진다.
     */
    const where = '/client/posting/addDirectory'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 입력 길이 췍!!
      const {dirName, parentDirOId} = data
      if (dirName.length > 30) {
        throw {gkd: {dirName: `폴더 이름은 30자 이하로 입력해주세요.`}, gkdErr: `폴더 이름 길이 초과`, gkdStatus: {dirName, parentDirOId}, where}
      }
      if (dirName.length < 2) {
        throw {gkd: {dirName: `폴더 이름은 2자 이상으로 입력해주세요.`}, gkdErr: `폴더 이름 길이 부족`, gkdStatus: {dirName, parentDirOId}, where}
      }
      if (!parentDirOId) {
        throw {gkd: {parentDirOId: `부모 폴더가 입력되지 않았습니다.`}, gkdErr: `부모 폴더 입력 안됨`, gkdStatus: {parentDirOId}, where}
      }
      if (parentDirOId === 'NULL' && dirName !== 'root') {
        throw {gkd: {parentDirOId: `이런 이름으로 폴더를 만들 수 없습니다.`}, gkdErr: `루트 폴더 입력 시도`, gkdStatus: {parentDirOId}, where}
      }

      // 3. 부모 폴더가 있는지 췍!!
      if (parentDirOId !== 'NULL') {
        const {directory: isParentDirExist} = await this.dbHubService.readDirectoryByDirOId(where, parentDirOId)
        if (!isParentDirExist) {
          throw {gkd: {parentDirOId: `부모 폴더가 없습니다.`}, gkdErr: `부모 폴더 조회 안됨`, gkdStatus: {parentDirOId}, where}
        }
      }

      // 4. 부모 폴더 내에서 이름 중복 췍!!
      if (parentDirOId !== 'NULL') {
        const {directory: isExist} = await this.dbHubService.readDirectoryByParentAndName(where, parentDirOId, dirName)
        if (isExist) {
          throw {gkd: {dirName: `이미 존재하는 이름입니다.`}, gkdErr: '중복된 이름 디렉토리 생성시도', gkdStatus: {dirName, parentDirOId}, where}
        }
      }

      // 5. 폴더 생성 뙇!!
      const {directory} = await this.dbHubService.createDirectory(where, parentDirOId, dirName)
      const {dirOId} = directory

      // 6. 생성한것이 루트인지 아닌지에 따라 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [],
        directories: {}
      }
      if (parentDirOId !== 'NULL') {
        /* 생성한게 root 는 아닌 경우 */
        const {directory: parentDir} = await this.dbHubService.updateDirectoryPushBackDir(where, parentDirOId, dirOId)
        extraDirs.dirOIdsArr.push(parentDirOId)
        extraDirs.directories[parentDirOId] = parentDir

        const arrLen = parentDir.subDirOIdsArr.length

        // 순서가 중요하기에 for 문으로 처리한다.
        for (let i = 0; i < arrLen; i++) {
          const subDirOId = parentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }
      } // ::
      else {
        /* 생성한게 root 인 경우 */
        extraDirs.dirOIdsArr.push(dirOId)
        extraDirs.directories[dirOId] = directory
      }

      // 7. 리턴용 extraFiles 뙇!!
      //    - 파일 추가를 한건 아니므로 빈 오브젝트를 리턴한다
      const extraFileRows: T.ExtraFileRowObjectType = {fileOIdsArr: [], fileRows: {}}

      // 8. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async addFile(jwtPayload: T.JwtPayloadType, data: HTTP.AddFileDataType) {
    const where = '/client/posting/addFile'
    try {
      const {fileName, parentDirOId} = data

      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 이름 길이 췍!!
      if (fileName.length < 2) {
        throw {gkd: {fileName: `파일 이름은 2자 이상으로 입력해주세요.`}, gkdErr: `파일 이름 길이 부족`, gkdStatus: {fileName, parentDirOId}, where}
      }
      if (fileName.length > 40) {
        throw {gkd: {fileName: `파일 이름은 40자 이하로 입력해주세요.`}, gkdErr: `파일 이름 길이 초과`, gkdStatus: {fileName, parentDirOId}, where}
      }

      // 3. 부모 폴더 존재 췍!!
      if (!parentDirOId || parentDirOId === 'NULL') {
        throw {gkd: {parentDirOId: `부모 폴더가 입력되지 않았습니다.`}, gkdErr: `부모 폴더 입력 안됨`, gkdStatus: {parentDirOId}, where}
      }

      // 4. 부모 폴더 내에서 이름 중복 췍!!
      const {file: isExist} = await this.dbHubService.readFileByParentAndName(where, parentDirOId, fileName)
      if (isExist) {
        throw {gkd: {fileName: `이미 존재하는 이름입니다.`}, gkdErr: '중복된 이름 파일 생성시도', gkdStatus: {fileName, parentDirOId}, where}
      }

      // 5. 파일 생성 뙇!!
      const {file} = await this.dbHubService.createFile(where, parentDirOId, fileName)
      const {fileOId} = file

      // 6. 부모 폴더의 fileOIdsArr 에 추가 뙇!!
      const {directory: parentDir} = await this.dbHubService.updateDirectoryPushBackFile(where, parentDirOId, fileOId)

      // 7. 리턴용 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [parentDirOId],
        directories: {[parentDirOId]: parentDir}
      }

      // 8. 리턴용 extraFiles 뙇!!
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }
      const arrLen = parentDir.fileOIdsArr.length

      for (let i = 0; i < arrLen; i++) {
        // 순서가 중요하므로 for 문으로 처리한다.
        const fileOId = parentDir.fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        const {name, isIntroPost, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
        extraFileRows.fileOIdsArr.push(fileOId)
        extraFileRows.fileRows[fileOId] = fileRow
      }

      // 9. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async deleteDirectory(jwtPayload: T.JwtPayloadType, dirOId: string) {
    const where = '/client/posting/deleteDirectory'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 디렉토리 조회 뙇!!
      const {directory} = await this.dbHubService.readDirectoryByDirOId(where, dirOId)
      if (!directory) {
        throw {gkd: {dirOId: `존재하지 않는 디렉토리입니다.`}, gkdErr: `디렉토리 조회 안됨`, gkdStatus: {dirOId}, where}
      } // ::
      else if (directory.parentDirOId === 'NULL') {
        throw {gkd: {dirOId: `루트 디렉토리는 삭제할 수 없습니다.`}, gkdErr: `루트 디렉토리 삭제시도`, gkdStatus: {dirOId}, where}
      }

      const {parentDirOId} = directory

      // 3. 디렉토리 재귀적으로 삭제 뙇!!
      await this._deleteDirRecursively(where, dirOId)

      // 4. 부모 디렉토리의 subDirOIdsArr 에서 삭제 뙇!! (중간에 삭제됬을 수 있음)
      const {directory: parentDir} = await this.dbHubService.updateDirectoryRemoveSubDir(where, parentDirOId, dirOId)

      // 5. 리턴용 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [parentDirOId],
        directories: {[parentDirOId]: parentDir}
      }
      if (parentDir) {
        const arrLen = parentDir.subDirOIdsArr.length
        for (let i = 0; i < arrLen; i++) {
          const subDirOId = parentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }
      }

      // 6. 리턴용 extraFiles 뙇!!
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }
      if (parentDir) {
        const fileLen = parentDir.fileOIdsArr.length
        for (let i = 0; i < fileLen; i++) {
          const fileOId = parentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }
      }

      // 7. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async deleteFile(jwtPayload: T.JwtPayloadType, fileOId: string) {
    /**
     * 부모폴더가 검색되지 않아도 삭제는 정상적으로 이루어져야 한다.
     * - 부모폴더가 중간에 삭제되었을수도 있다.
     */
    const where = '/client/posting/deleteFile'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. fileOId 24글자인지 췍!!
      if (fileOId.length !== 24) {
        throw {gkd: {fileOId: `파일 아이디는 24글자여야 합니다.`}, gkdErr: `파일 아이디 길이 부족`, gkdStatus: {fileOId}, where}
      }

      // 3. 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
      if (!file) {
        // 파일이 이미 지워진 경우라면 부모 폴더 정보를 어차피 못 가져온다.
        throw {gkd: {fileOId: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOId}, where}
      }

      // 4. 파일 삭제 뙇!!
      await this.dbHubService.deleteFile(where, fileOId)

      // 5. 부모 디렉토리의 fileOIdsArr 에서 삭제 뙇!!
      const {parentDirOId} = file
      const {directory: parentDir} = await this.dbHubService.updateDirectoryRemoveSubFile(where, parentDirOId, fileOId)

      // 6. 리턴용 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [parentDirOId],
        directories: {[parentDirOId]: parentDir}
      }
      const arrLen = parentDir.subDirOIdsArr.length
      for (let i = 0; i < arrLen; i++) {
        const subDirOId = parentDir.subDirOIdsArr[i]
        const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
        extraDirs.dirOIdsArr.push(subDirOId)
        extraDirs.directories[subDirOId] = directory
      }

      // 7. 리턴용 extraFiles 뙇!!
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }
      const fileLen = parentDir.fileOIdsArr.length
      for (let i = 0; i < fileLen; i++) {
        const fileOId = parentDir.fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        const {name, isIntroPost, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
        extraFileRows.fileOIdsArr.push(fileOId)
        extraFileRows.fileRows[fileOId] = fileRow
      }

      // 8. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async moveDirectory(jwtPayload: T.JwtPayloadType, data: HTTP.MoveDirectoryDataType) {
    /**
     * targetIdx 가 null 이면 부모폴더의 맨 뒤로 이동한다.
     */
    const where = '/client/posting/moveDirectoryBack'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 입력에 공백 췍!!
      const {moveDirOId, parentDirOId, targetIdx} = data
      if (!moveDirOId) {
        throw {gkd: {moveDirOId: `이동할 폴더가 입력되지 않았습니다.`}, gkdErr: `이동할 폴더 입력 안됨`, gkdStatus: {moveDirOId}, where}
      }
      if (!parentDirOId) {
        throw {gkd: {parentDirOId: `부모 폴더가 입력되지 않았습니다.`}, gkdErr: `부모 폴더 입력 안됨`, gkdStatus: {parentDirOId}, where}
      }
      if (targetIdx === undefined) {
        throw {gkd: {targetIdx: `목적 인덱스가 입력되지 않았습니다.`}, gkdErr: `목적 인덱스 입력 안됨`, gkdStatus: {targetIdx}, where}
      }

      // 3. 자기 자신으로 이동하는지 췍!!
      if (moveDirOId === parentDirOId) {
        throw {
          gkd: {moveDirOId: `이동할 폴더와 부모 폴더가 같습니다.`},
          gkdErr: `이동할 폴더와 부모 폴더가 같음`,
          gkdStatus: {moveDirOId, parentDirOId},
          where
        }
      }

      // 4. 이동시킬 폴더 존재하는지 췍!!
      const {directory: moveDir} = await this.dbHubService.readDirectoryByDirOId(where, moveDirOId)
      if (!moveDir) {
        throw {gkd: {moveDirOId: `존재하지 않는 폴더입니다.`}, gkdErr: `이동할 폴더 조회 안됨`, gkdStatus: {moveDirOId}, where}
      }

      // 5. 목적지 폴더 있는지 췍!! 은 6번에서 한다.

      // 6. 조상이 자손으로 이동하려는지 췍!!
      let _tempDirOId = parentDirOId
      while (_tempDirOId !== 'NULL') {
        const {directory: _tempDir} = await this.dbHubService.readDirectoryByDirOId(where, _tempDirOId)

        // 6-1. 목적지 폴더의 현재 조상폴더가 있는지 췍!!
        if (!_tempDir) {
          throw {gkd: {_tempDirOId: `존재하지 않는 폴더입니다.`}, gkdErr: `조상 폴더 조회 안됨`, gkdStatus: {_tempDirOId}, where}
        }

        // 6-2. 현재 조상폴더가 이동시킬 폴더면 에러 뙇!!
        if (_tempDir.dirOId === moveDirOId) {
          throw {
            gkd: {moveDirOId: `조상이 자손으로 이동하려는 경우입니다.`},
            gkdErr: `조상이 자손으로 이동시도`,
            gkdStatus: {moveDirOId, parentDirOId},
            where
          }
        }

        // 6-3. 현재 조상폴더의 부모 폴더로 바꾸고 확인한다.
        _tempDirOId = _tempDir.parentDirOId
      }

      // __: 리턴용 오브젝트들 미리 선언
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [],
        directories: {}
      }
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }

      // 7. 목적지 폴더에 같은 이름 있나 췍!!
      if (moveDir.parentDirOId !== parentDirOId) {
        // 부모폴더 내에서 위치만 바꾸는 경우면 당연히 중복된 이름이 존재한다.
        const {directory: targetDir} = await this.dbHubService.readDirectoryByParentAndName(where, parentDirOId, moveDir.dirName)
        if (targetDir) {
          throw {gkd: {parentDirOId: `목적지 폴더에 같은 이름 있습니다.`}, gkdErr: `목적지 폴더에 같은 이름 있음`, gkdStatus: {parentDirOId}, where}
        }
      }

      /**
       * 8. 이동 뙇!!
       *   8-1. 같은 부모폴더 내에서 이동하는 경우
       *   8.2. 부모폴더가 바뀌는 경우
       */
      if (moveDir.parentDirOId === parentDirOId) {
        // 8-1. 같은 부모폴더 내에서 이동하는 경우

        // 8-1-1. 부모 폴더의 자식들의 인덱스를 바꾼다.
        const {directory: newParentDir} = await this.dbHubService.updateDirectorySubDirsSequence(where, parentDirOId, moveDirOId, targetIdx)

        extraDirs.dirOIdsArr.push(parentDirOId)
        extraDirs.directories[parentDirOId] = newParentDir

        // 8-1-2. 부모 폴더의 자식 폴더들을 갱신해서 넘겨준다.
        const dirArrLen = newParentDir.subDirOIdsArr.length
        for (let i = 0; i < dirArrLen; i++) {
          const subDirOId = newParentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 8-1-3. 부모 폴더의 자식 파일들을 갱신해서 넘겨준다.
        const fileArrLen = newParentDir.fileOIdsArr.length
        for (let i = 0; i < fileArrLen; i++) {
          const fileOId = newParentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }
        // ::
      } // ::
      else {
        // 8.2. 부모폴더가 바뀌는 경우

        // 8-2-1. 이동하는 폴더의 부모를 바꾼다.
        const {directory: newMoveDir} = await this.dbHubService.updateDirectoryParent(where, moveDirOId, parentDirOId)

        // 8-2-2. 새로운 부모의 자식폴더 목록에 추가한다.
        const {directory: newParentDir} = await this.dbHubService.updateDirectoryAddSubDir(where, parentDirOId, moveDirOId, targetIdx)

        // 8-2-3. 기존 부모폴더에서 삭제한다.
        const {directory: oldParentDir} = await this.dbHubService.updateDirectoryRemoveSubDir(where, moveDir.parentDirOId, moveDirOId)

        // 8-2-4. extraDirs 에 이동하는 폴더를 추가한다.
        extraDirs.dirOIdsArr.push(moveDirOId)
        extraDirs.directories[moveDirOId] = newMoveDir

        // 8-2-5. extraDirs 에 새로운 부모폴더와 그 자식폴더들의 정보를 추가한다.
        extraDirs.dirOIdsArr.push(parentDirOId)
        extraDirs.directories[parentDirOId] = newParentDir

        const dirArrLen = newParentDir.subDirOIdsArr.length
        for (let i = 0; i < dirArrLen; i++) {
          const subDirOId = newParentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 8-2-6. extraDirs 에 기존 부모폴더와 그 자식폴더들의 정보를 추가한다.
        extraDirs.dirOIdsArr.push(moveDir.parentDirOId)
        extraDirs.directories[moveDir.parentDirOId] = oldParentDir

        const oldDirArrLen = oldParentDir.subDirOIdsArr.length
        for (let i = 0; i < oldDirArrLen; i++) {
          const subDirOId = oldParentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 8-2-7. extraFileRows 에 새로운 부모모 폴더의 파일들의 정보를 추가한다.
        const fileArrLen = newParentDir.fileOIdsArr.length
        for (let i = 0; i < fileArrLen; i++) {
          const fileOId = newParentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }

        // 8-2-8. extraFileRows 에 기존 부모폴더의 파일들의 정보를 추가한다.
        const oldFileArrLen = oldParentDir.fileOIdsArr.length
        for (let i = 0; i < oldFileArrLen; i++) {
          const fileOId = oldParentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }
      } // END: 8. 이동 뙇!!

      // 9. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async moveFile(jwtPayload: T.JwtPayloadType, data: HTTP.MoveFileDataType) {
    const where = '/client/posting/moveFile'
    /**
     * 점검할 것들
     *   Check 1. 권한 췍!!
     *   Check 2. 입력값 췍!!
     *   Check 3. 옮길 파일 DB에 존재하는지 췍!!
     *   Check 4. 목적지 폴더 DB에 존재하는지 췍!!
     *   Check 5. 목적지 폴더에 같은 이름 파일 있는지 췍!!
     *
     * 작동 (부모 바뀌는 경우)
     *   1. 파일의 부모폴더 바꾸기
     *   2. 새로운 부모폴더에 파일 추가
     *   3. 기존 부모폴더에서 파일 삭제
     *   4. 리턴용 extraDirs 뙇!!
     *   5. 리턴용 extraFileRows 뙇!!
     *   6. 리턴 뙇!!
     */
    try {
      // Check 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // Check 2. 입력값 췍!!
      const {moveFileOId, targetDirOId, targetIdx} = data
      if (!moveFileOId) {
        throw {gkd: {moveFileOId: `이동할 파일이 입력되지 않았습니다.`}, gkdErr: `이동할 파일 입력 안됨`, gkdStatus: {moveFileOId}, where}
      }
      if (!targetDirOId) {
        throw {gkd: {targetDirOId: `목적지 폴더가 입력되지 않았습니다.`}, gkdErr: `목적지 폴더 입력 안됨`, gkdStatus: {targetDirOId}, where}
      }
      if (targetIdx === undefined) {
        throw {gkd: {targetIdx: `목적지 인덱스가 입력되지 않았습니다.`}, gkdErr: `목적지 인덱스 입력 안됨`, gkdStatus: {targetIdx}, where}
      }

      // Check 3. 옮길 파일 DB에 존재하는지 췍!!
      const {file: moveFile} = await this.dbHubService.readFileByFileOId(where, moveFileOId)
      if (!moveFile) {
        throw {gkd: {moveFileOId: `존재하지 않는 파일입니다.`}, gkdErr: `이동할 파일 조회 안됨`, gkdStatus: {moveFileOId}, where}
      }

      // Check 4. 목적지 폴더 DB에 존재하는지 췍!!
      const {directory: targetDir} = await this.dbHubService.readDirectoryByDirOId(where, targetDirOId)
      if (!targetDir) {
        throw {gkd: {targetDirOId: `존재하지 않는 폴더입니다.`}, gkdErr: `목적지 폴더 조회 안됨`, gkdStatus: {targetDirOId}, where}
      }

      // Check 5. 목적지 폴더에 같은 이름 파일 있는지 췍!!
      if (moveFile.parentDirOId !== targetDirOId) {
        // 부모 폴더 내에서 순서만 바꾸는 경우는 당연하게 중복된 파일이 존재한다.
        const {file: targetFile} = await this.dbHubService.readFileByParentAndName(where, targetDirOId, moveFile.name)
        if (targetFile) {
          throw {
            gkd: {targetDirOId: `목적지 폴더에 같은 이름 파일 있습니다.`},
            gkdErr: `목적지 폴더에 같은 이름 파일 있음`,
            gkdStatus: {targetDirOId},
            where
          }
        }
      }

      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [],
        directories: {}
      }
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }

      // 부모가 바뀌는 경우와 바뀌지 않는 경우를 고려해야 한다.
      if (moveFile.parentDirOId === targetDirOId) {
        // 1. 부모가 바뀌지 않는 경우

        // 1-1. 부모 폴더의 자식파일의 인덱스를 바꾼다.
        const {directory: newParentDir} = await this.dbHubService.updateDirectoryFileSequence(where, targetDirOId, moveFileOId, targetIdx)

        // 1-2. 부모 폴더를 extraDirs 에 넣는다.
        extraDirs.dirOIdsArr.push(targetDirOId)
        extraDirs.directories[targetDirOId] = newParentDir

        // 1-3. 부모 폴더의 자식폴더들을 extraDirs 에 넣는다.
        const dirArrLen = newParentDir.subDirOIdsArr.length
        for (let i = 0; i < dirArrLen; i++) {
          const subDirOId = newParentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 1-4. 부모 폴더의 자식파일들을 extraFileRows 에 넣는다.
        const fileArrLen = newParentDir.fileOIdsArr.length
        for (let i = 0; i < fileArrLen; i++) {
          const fileOId = newParentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }
      } // ::
      else {
        // 2. 부모가 바뀌는 경우

        // 2-1. 이동하는 파일의 부모를 바꾼다.
        const {file: newMoveFile} = await this.dbHubService.updateFileParent(where, moveFileOId, targetDirOId)

        // 2-2. 새로운 부모의 자식폴더 목록에 추가한다.
        const {directory: newParentDir} = await this.dbHubService.updateDirectoryAddFile(where, targetDirOId, moveFileOId, targetIdx)

        // 2-3. 기존 부모폴더에서 삭제한다.
        const {directory: oldParentDir} = await this.dbHubService.updateDirectoryRemoveSubFile(where, moveFile.parentDirOId, moveFileOId)

        // 2-4. extraDirs 에 추가: 새로운 부모 폴더와 그 자식폴더
        extraDirs.dirOIdsArr.push(targetDirOId)
        extraDirs.directories[targetDirOId] = newParentDir

        const dirArrLen = newParentDir.subDirOIdsArr.length
        for (let i = 0; i < dirArrLen; i++) {
          const subDirOId = newParentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 2-5. extraDirs 에 추가: 기존 부모 폴더와 그 자식폴더
        extraDirs.dirOIdsArr.push(moveFile.parentDirOId)
        extraDirs.directories[moveFile.parentDirOId] = oldParentDir

        const oldDirArrLen = oldParentDir.subDirOIdsArr.length
        for (let i = 0; i < oldDirArrLen; i++) {
          const subDirOId = oldParentDir.subDirOIdsArr[i]
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        }

        // 2-6. extraFileRows 에 추가: 옮겨진 파일
        extraFileRows.fileOIdsArr.push(moveFileOId)
        extraFileRows.fileRows[moveFileOId] = {
          fileOId: moveFileOId,
          name: newMoveFile.name,
          parentDirOId: newParentDir.dirOId,
          isIntroPost: newMoveFile.isIntroPost
        }

        // 2-7. extraFileRows 에 추가: 새로운 부모 폴더의 파일들
        const fileArrLen = newParentDir.fileOIdsArr.length
        for (let i = 0; i < fileArrLen; i++) {
          const fileOId = newParentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }

        // 2-8. extraFileRows 에 추가: 기존 부모 폴더의 파일들
        const oldFileArrLen = oldParentDir.fileOIdsArr.length
        for (let i = 0; i < oldFileArrLen; i++) {
          const fileOId = oldParentDir.fileOIdsArr[i]
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          const {name, isIntroPost, parentDirOId} = file
          const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
          extraFileRows.fileOIdsArr.push(fileOId)
          extraFileRows.fileRows[fileOId] = fileRow
        }
      } // END: 파일 이동

      // 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async setDirName(jwtPayload: T.JwtPayloadType, data: HTTP.SetDirNameDataType) {
    const where = '/client/posting/setDirName'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 폴더 이름 변경 뙇!!
      //    - 같은 이름을 입력해도 정상 작동하게 한다.
      //    - 하위 파일들 정보는 넘겨주기 위함이다.
      const {dirOId, newDirName} = data
      const {directory} = await this.dbHubService.updateDirectoryName(where, dirOId, newDirName)

      // 3. 리턴용 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [dirOId],
        directories: {[dirOId]: directory}
      }

      // 4. 리턴용 extraFiles 뙇!!
      //    - 다른 탭 등에서 파일 변경이 있었을 수 있다.
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }
      const fileArrLen = directory.fileOIdsArr.length
      for (let i = 0; i < fileArrLen; i++) {
        const fileOId = directory.fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        const {name, isIntroPost, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
        extraFileRows.fileOIdsArr.push(fileOId)
        extraFileRows.fileRows[fileOId] = fileRow
      }

      // 5. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async setFileNameAndContents(jwtPayload: T.JwtPayloadType, data: HTTP.SetFileNameContentsDataType) {
    const where = '/client/posting/setFileNameAndContents'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 파일 변경 뙇!!
      const {fileOId, name, contentsArr} = data

      // 3. 파일 이름 변경 뙇!!
      const {file} = await this.dbHubService.updateFileNameAndContents(where, fileOId, name, contentsArr)
      const {parentDirOId} = file
      const {directory: parentDir} = await this.dbHubService.readDirectoryByDirOId(where, parentDirOId)

      // 4. 리턴용 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [parentDirOId],
        directories: {[parentDirOId]: parentDir}
      }
      const dirArrLen = parentDir.subDirOIdsArr.length
      for (let i = 0; i < dirArrLen; i++) {
        const subDirOId = parentDir.subDirOIdsArr[i]
        const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
        extraDirs.dirOIdsArr.push(subDirOId)
        extraDirs.directories[subDirOId] = directory
      }

      // 5. 리턴용 extraFiles 뙇!!
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }
      const fileArrLen = parentDir.fileOIdsArr.length
      for (let i = 0; i < fileArrLen; i++) {
        const fileOId = parentDir.fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        const {name, isIntroPost, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
        extraFileRows.fileOIdsArr.push(fileOId)
        extraFileRows.fileRows[fileOId] = fileRow
      }

      // 6. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async toggleFilesIsIntroPost(jwtPayload: T.JwtPayloadType, data: HTTP.ToggleFilesIsIntroDataType) {
    const where = '/client/posting/toggleFilesIsIntroPost'
    /**
     * 파일의 공지여부를 토글하는 함수
     * 1. 권한 췍!!
     * 2. 파일 존재 여부 췍!!
     * 3. 파일 공지여부 토글 뙇!!
     * 4. 리턴용 extraFileRows 뙇!!
     * 5. 리턴 뙇!!
     */
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 파일 존재 여부 췍!!
      const {fileOId} = data
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
      if (!file) {
        throw {gkd: {fileOId: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOId}, where}
      }

      // 3. 파일 공지여부 토글 뙇!!
      const {file: newFile, prevIntroFileArr} = await this.dbHubService.updateFileToggleIsIntroPost(where, fileOId)
      const {isIntroPost} = newFile

      // 4. 리턴용 extraFileRows 뙇!!
      const {name, parentDirOId} = newFile
      const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost}
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr: [fileOId],
        fileRows: {[fileOId]: fileRow}
      }

      // 5. prevArr 에서 extraFileRows 로 뙇!!
      prevIntroFileArr.forEach(file => {
        const {fileOId, name, parentDirOId} = file
        const fileRow: T.FileRowType = {fileOId, name, parentDirOId, isIntroPost: false}
        extraFileRows.fileOIdsArr.push(fileOId)
        extraFileRows.fileRows[fileOId] = fileRow
      })

      // 6. 리턴 뙇!!
      return {extraFileRows, isIntroPost}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA3: ClientReading_토큰 필요 없는 함수들
  async readCommentsArr(fileOId: string) {
    const where = '/client/reading/readCommentsArr'
    try {
      // date 값에 의해 정렬이 된 채로 들어온다.
      const {commentsArr} = await this.dbHubService.readCommentsArrByFileOId(where, fileOId)
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readFile(fileOid: string) {
    const where = '/client/reading/readFile'
    try {
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOid)
      if (!file) {
        throw {gkd: {fileOid: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOid}, where}
      }
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA4: ClientReading_토큰 필요한 함수들
  async addComment(jwtPayload: T.JwtPayloadType, data: HTTP.AddCommentDataType) {
    /**
     * 파일에 댓글 추가하는 함수
     * 1. 권한 췍!!
     * 2. 입력값 췍!!
     * 3. 파일 존재 여부 췍!!
     * 4. 유저 존재 여부 췍!!
     * 5. 댓글 추가 뙇!!
     * 6. 리턴용 commentsArr 뙇!!
     * 7. 리턴 뙇!!
     *
     * 유의사항
     * - 게시글 작성자에게 알람을 보내거나 관련 DB 를 손보는건 여기서 하지 않는다.
     *   - 소켓이 연결되었는지 여부가 작동에 영향을 미친다.
     *   - 소켓이 연결되었는지 여부를 여기서 체크할 수 없다.
     *     - port 서비스는 DB 쪽에 붙어있다.
     *     - 소켓 서비스는 request 쪽에 붙어있다.
     *     - DB 가 request 에게 뭔가를 요청하면 안된다.
     */

    const where = '/client/reading/addComment'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. 입력값 췍!!
      const {content, fileOId, userOId} = data
      if (!content || content.length > 200) {
        throw {gkd: {content: `댓글 내용이 이상해요`}, gkdErr: `댓글 내용 오류`, gkdStatus: {content}, where}
      }
      if (!fileOId || fileOId.length !== 24) {
        throw {gkd: {fileOId: `파일 번호가 이상해요`}, gkdErr: `파일 번호 오류`, gkdStatus: {fileOId}, where}
      }
      if (!userOId || userOId.length !== 24) {
        throw {gkd: {userOId: `사용자 번호가 이상해요`}, gkdErr: `사용자 번호 오류`, gkdStatus: {userOId}, where}
      }

      // 3. 파일 존재 여부 췍!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
      if (!file) {
        throw {gkd: {fileOId: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOId}, where}
      }

      // 4. 유저 존재 여부 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 사용자입니다.`}, gkdErr: `사용자 조회 안됨`, gkdStatus: {userOId}, where}
      }

      // 5. 댓글 추가 뙇!!
      const {comment} = await this.dbHubService.createComment(where, fileOId, userOId, user.userName, content)

      // 6. 리턴용 commentsArr, fileUserOId 뙇!!
      const {commentsArr} = await this.dbHubService.readCommentsArrByFileOId(where, fileOId)
      const {user: adminUser} = await this.dbHubService.readUserByUserId(where, adminUserId)
      const fileUserOId = adminUser.userOId

      // comment, fileUserOId 는 댓글 알람을 위해서 넘겨준다.

      // 7. 리턴 뙇!!
      return {comment, commentsArr, fileUserOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async addReply(jwtPayload: T.JwtPayloadType, data: HTTP.AddReplyDataType) {
    /**
     * 파일의 댓글에 대댓글을 추가하는 함수
     * 1. 권한 췍!!
     * 2. 입력값 췍!!
     * 3. 댓글 존재 여부 췍!!
     * 4. 댓글이 달린 파일 존재 여부 췍!!
     * 5. 대댓글 추가 뙇!!
     * 6. 리턴용 commentsArr 뙇!!
     * 7. 리턴 뙇!!
     */
    const where = '/client/reading/addReply'
    try {
      const {commentOId, content, targetUserName, targetUserOId} = data
      const {userName, userOId} = jwtPayload

      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. 입력값 췍!!
      if (!commentOId || commentOId.length !== 24) {
        throw {gkd: {commentOId: `댓글 고유번호가 이상해요`}, gkdErr: `댓글 번호 오류`, gkdStatus: {commentOId}, where}
      }
      if (!content || content.length > 200) {
        throw {gkd: {content: `대댓글 내용이 이상해요`}, gkdErr: `대댓글 내용 오류`, gkdStatus: {content}, where}
      }
      if (!targetUserName) {
        throw {gkd: {targetUserName: `대댓글 대상자 이름이 이상해요`}, gkdErr: `대댓글 대상자 이름 오류`, gkdStatus: {targetUserName}, where}
      }
      if (!targetUserOId || targetUserOId.length !== 24) {
        throw {gkd: {targetUserOId: `대댓글 대상자 고유번호가 이상해요`}, gkdErr: `대댓글 대상자 고유번호 오류`, gkdStatus: {targetUserOId}, where}
      }

      // 3. 댓글 존재 여부 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 댓글입니다.`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}
      }

      // 4. 댓글이 달린 파일 존재 여부 췍!!
      const {file} = await this.dbHubService.readFileByFileOId(where, comment.fileOId)
      if (!file) {
        throw {gkd: {fileOId: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOId: comment.fileOId}, where}
      }

      // 5. 대댓글 추가 뙇!!
      const {reply} = await this.dbHubService.createReply(where, commentOId, targetUserName, targetUserOId, userName, userOId, content)

      // 6. 리턴용 commentsArr 뙇!!
      const {commentsArr} = await this.dbHubService.readCommentsArrByFileOId(where, comment.fileOId)

      // 7. 리턴 뙇!!
      return {commentsArr, reply}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async deleteComment(jwtPayload: T.JwtPayloadType, commentOId: string) {
    const where = '/client/reading/deleteComment'
    /**
     * 파일의 댓글을 삭제하는 함수
     * 1. 권한 췍!!
     * 2. 입력값 췍!!
     * 3. 댓글 존재여부 췍!!
     * 4. 댓글 삭제 & 리턴용 commentsArr 뙇!!
     * 5. 리턴 뙇!!
     */
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthComment(where, jwtPayload, commentOId)

      // 2. 입력값 췍!!
      if (!commentOId || commentOId.length !== 24) {
        throw {gkd: {commentOId: `댓글 번호가 이상해요`}, gkdErr: `댓글 번호 오류`, gkdStatus: {commentOId}, where}
      }

      // 3. 댓글 존재여부 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 댓글입니다.`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}
      }

      // 4. 댓글 삭제 & 리턴용 commentsArr 뙇!!
      const {commentsArr} = await this.dbHubService.deleteComment(where, commentOId)

      // 5. 리턴 뙇!!
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async deleteReply(jwtPayload: T.JwtPayloadType, data: HTTP.DeleteReplyDataType) {
    /**
     * 파일의 대댓글을 지우는 함수
     *
     * 1. 권한 췍!!
     * 2. 입력값 췍!!
     * 3. 댓글 존재여부 췍!!
     * 4. 대댓글 존재여부 췍!!
     * 5. 대댓글 삭제 뙇!!
     * 6. 리턴용 commentsArr 뙇!!
     * 7. 리턴 뙇!!
     */
    const where = '/client/reading/deleteReply'
    try {
      const {commentOId, dateString, userOId} = data
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthReply(where, jwtPayload, commentOId, dateString)

      // 2. 입력값 췍!!
      if (!commentOId || commentOId.length !== 24) {
        throw {gkd: {commentOId: `댓글 번호가 이상해요`}, gkdErr: `댓글 번호 오류`, gkdStatus: {commentOId}, where}
      }
      if (!dateString) {
        throw {gkd: {dateString: `대댓글 날짜가 이상해요`}, gkdErr: `대댓글 날짜 오류`, gkdStatus: {dateString}, where}
      }

      // 3. 댓글 존재여부 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 댓글입니다.`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}
      }

      // 4. 대댓글 존재여부 췍!!
      const {reply} = await this.dbHubService.readReply(where, commentOId, dateString, userOId)
      if (!reply) {
        throw {gkd: {commentOId: `존재하지 않는 대댓글입니다.`}, gkdErr: `대댓글 조회 안됨`, gkdStatus: {commentOId, dateString}, where}
      }

      // 5. 대댓글 삭제 뙇!!
      await this.dbHubService.deleteReply(where, commentOId, dateString, userOId)

      // 6. 리턴용 commentsArr 뙇!!
      const {commentsArr} = await this.dbHubService.readCommentsArrByFileOId(where, comment.fileOId)

      // 7. 리턴 뙇!!
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async modifyComment(jwtPayload: T.JwtPayloadType, data: HTTP.ModifyCommentDataType) {
    /**
     * 파일의 댓글을 수정하는 함수
     * 1. 권한 췍!!
     * 2. 입력값 췍!!
     * 3. 댓글 존재여부 췍!!
     * 4. 파일 존재여부 췍!!
     * 5. 댓글 수정 & 리턴용 commentsArr 뙇!!
     * 6. 리턴 뙇!!
     */
    const where = '/client/reading/modifyComment'
    try {
      const {commentOId, content} = data

      // 1. 권한 췍!!
      await this.dbHubService.checkAuthComment(where, jwtPayload, commentOId)

      // 2. 입력값 췍!!
      if (!commentOId || commentOId.length !== 24) {
        throw {gkd: {commentOId: `댓글 번호가 이상해요`}, gkdErr: `댓글 번호 오류`, gkdStatus: {commentOId}, where}
      }
      if (!content || content.length > 200) {
        throw {gkd: {content: `댓글 내용이 이상해요`}, gkdErr: `댓글 내용 오류`, gkdStatus: {content}, where}
      }

      // 3. 댓글 존재여부 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 댓글입니다.`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}
      }

      // 4. 파일 존재여부 췍!!
      const {file} = await this.dbHubService.readFileByFileOId(where, comment.fileOId)
      if (!file) {
        throw {gkd: {fileOId: `존재하지 않는 파일입니다.`}, gkdErr: `파일 조회 안됨`, gkdStatus: {fileOId: comment.fileOId}, where}
      }

      // 5. 댓글 수정 & 리턴용 commentsArr 뙇!!
      const {commentsArr} = await this.dbHubService.updateCommentContent(where, commentOId, content)

      // 6. 리턴 뙇!!
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj // ::
    }
  }

  async modifyReply(jwtPayload: T.JwtPayloadType, data: HTTP.ModifyReplyDataType) {
    /**
     * 파일의 대댓글을 수정하는 함수
     * 1. 권한 췍!!
     * 2. 입력값 췍!!
     * 3. 댓글 존재여부 췍!!
     * 4. 대댓글 존재여부 췍!!
     * 5. 대댓글 수정
     * 6. 리턴용 commentsArr 뙇!!
     * 7. 리턴 뙇!!
     */
    const where = '/client/reading/modifyReply'
    try {
      const {commentOId, content, dateString, userOId} = data

      // 1. 권한 췍!!
      await this.dbHubService.checkAuthReply(where, jwtPayload, commentOId, dateString)

      // 2. 입력값 췍!!
      if (!commentOId || commentOId.length !== 24) {
        throw {gkd: {commentOId: `댓글 번호가 이상해요`}, gkdErr: `댓글 번호 오류`, gkdStatus: {commentOId}, where}
      }
      if (!dateString) {
        throw {gkd: {dateString: `대댓글 날짜가 이상해요`}, gkdErr: `대댓글 날짜 오류`, gkdStatus: {dateString}, where}
      }
      if (!content || content.length > 200) {
        throw {gkd: {content: `대댓글 내용이 이상해요`}, gkdErr: `대댓글 내용 오류`, gkdStatus: {content}, where}
      }

      // 3. 댓글 존재여부 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {gkd: {commentOId: `존재하지 않는 댓글입니다.`}, gkdErr: `댓글 조회 안됨`, gkdStatus: {commentOId}, where}
      }

      // 4. 대댓글 존재여부 췍!!
      const {reply} = await this.dbHubService.readReply(where, commentOId, dateString, userOId)
      if (!reply) {
        throw {gkd: {commentOId: `존재하지 않는 대댓글입니다.`}, gkdErr: `대댓글 조회 안됨`, gkdStatus: {commentOId, dateString}, where}
      }

      // 5. 대댓글 수정
      await this.dbHubService.updateReplyContent(where, commentOId, dateString, content)

      // 6. 리턴용 commentsArr 뙇!!
      const {commentsArr} = await this.dbHubService.readCommentsArrByFileOId(where, comment.fileOId)

      // 7. 리턴 뙇!!
      return {commentsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  // AREA1: ClientUserInfo_토큰 필요 없는 함수들

  // AREA2: ClientUserInfo_토큰 필요한 함수들

  async deleteAlarm(jwtPayload: T.JwtPayloadType, alarmOId: string) {
    const where = '/client/userInfo/deleteAlarm'
    /**
     * 알람을 확인하여 삭제하는 함수
     *
     * 1. 알람 있는지 췍!!
     * 2. 해당 알람에 권한 있는지 췍!!
     * 3. 삭제 뙇!!
     */
    try {
      // 1. 알람 있는지 췍!!
      const {alarm} = await this.dbHubService.readAlarm(where, alarmOId)
      if (!alarm) {
        throw {gkd: {alarmOId: `존재하지 않는 알람입니다.`}, gkdErr: `알람 조회 안됨`, gkdStatus: {alarmOId}, where}
      }

      // 2. 해당 알람에 권한 있는지 췍!!
      if (jwtPayload.userOId !== alarm.targetUserOId) {
        throw {gkd: {userOId: `권한이 없는 유저입니다.`}, gkdErr: `권한 오류`, gkdStatus: {userOId: jwtPayload.userOId}, where}
      }

      // 3. 삭제 뙇!!
      await this.dbHubService.deleteAlarm(where, alarmOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async getAlarmArr(jwtPayload: T.JwtPayloadType, userOId: string) {
    const where = '/client/userInfo/getAlarmArr'
    /**
     * userOId 의 알람 배열을 리턴한다.
     *
     * 1. 권한 췍!!
     * 2. payload 와 유저 일치하나 췍!!
     * 3. 유저 있나 췍!!
     * 4. 알람 배열 뙇!!
     * 5. 리턴 뙇!!
     */
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. payload 와 유저 일치하나 췍!!
      if (jwtPayload.userOId !== userOId) {
        throw {gkd: {userOId: `유저 고유번호가 이상해요`}, gkdErr: `유저 고유번호 오류`, gkdStatus: {userOId}, where}
      }

      // 3. 유저 있나 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {userOId}, where}
      }

      // 4. 알람 배열 뙇!!
      const {alarmArr} = await this.dbHubService.readAlarmArr(where, userOId)

      // 5. 리턴 뙇!!
      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async getChatArr(jwtPayload: T.JwtPayloadType, chatRoomOId: string, firstIndex: number) {
    const where = '/client/userInfo/getChatArr'
    /**
     * chatRoomOId 의 채팅 배열을 리턴한다.
     * - firstIndex >=0 : firstIndex - 1 부터 10개
     * - firstIndex < 0 : 가장 최근것부터 10개
     *
     * 1. 권한 췍!!
     * 2. 채팅방 존재여부 췍!!
     * 3. 채팅방의 유저인지 췍!!
     * 4. 채팅방에 락을 뙇!!
     * 5. 채팅 배열 뙇!!
     * 6. 리턴 뙇!!
     */
    let readyLock = ''
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. 채팅방 존재여부 췍!!
      const {chatRoom} = await this.dbHubService.readChatRoomByChatRoomOId(where, chatRoomOId)
      if (!chatRoom) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      // 3. 채팅방의 유저인지 췍!!
      if (!chatRoom.userOIdsArr.includes(jwtPayload.userOId)) {
        throw {gkd: {userOId: `권한이 없는 유저입니다.`}, gkdErr: `권한 오류`, gkdStatus: {userOId: jwtPayload.userOId}, where}
      }

      // 4. 채팅방에 락을 뙇!!
      readyLock = await this.lockService.readyLock(chatRoomOId)

      // 5. 채팅 배열 뙇!!
      const numReadChatMax = 10
      const {chatArr} = await this.dbHubService.readChatArr(where, chatRoomOId, firstIndex, numReadChatMax)

      // 6. 리턴 뙇!!
      return {chatArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      if (readyLock) {
        await this.lockService.releaseLock(readyLock)
      }
      // ::
    }
  }

  async getChatRoom(jwtPayload: T.JwtPayloadType, chatRoomOId: string) {
    const where = '/client/userInfo/getChatRoom'
    /**
     * chatRoomOId 의 채팅방 정보를 리턴한다.
     *
     * 1. 권한 췍!!
     * 2. 채팅방 존재여부 췍!!
     * 3. 채팅방의 유저인지 췍!!
     * 4. 리턴 뙇!!
     */
    try {
      const {userOId} = jwtPayload

      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. 채팅방 존재여부 췍!!
      const {chatRoom} = await this.dbHubService.readChatRoomByChatRoomOId(where, chatRoomOId)
      if (!chatRoom) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      // 3. 채팅방의 유저인지 췍!!
      if (!chatRoom.userOIdsArr.includes(userOId)) {
        throw {gkd: {userOId: `권한이 없는 유저입니다.`}, gkdErr: `권한 오류`, gkdStatus: {userOId: jwtPayload.userOId}, where}
      }

      // 4. 채팅방 이름을 가져오기 위해 유저 조회 뙇!!
      const targetUserOId = chatRoom.userOIdsArr.find(_userOId => _userOId !== userOId)
      const {user} = await this.dbHubService.readUserByUserOId(where, targetUserOId)
      if (!user) {
        throw {gkd: {targetUserOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {targetUserOId}, where}
      }
      chatRoom.targetUserName = user.userName

      // 5. 리턴 뙇!!
      return {chatRoom}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async getChatRoomRow(jwtPayload: T.JwtPayloadType, userOId: string, chatRoomOId: string) {
    const where = '/client/userInfo/getChatRoomRow'
    /**
     * 채팅방 행 하나만 가져온다.
     *
     * 1. 권한 췍!!
     * 2. payload 와 유저 일치하나 췍!!
     * 3. 채팅방 존재여부 췍!!
     * 4. 채팅방의 유저인지 췍!!
     * 5. 채팅방 행 생성 위한 타겟 유저 뙇!!
     * 6. 안 읽은 메시지 뙇!!
     * 7. 채팅방 행 생성 뙇!!
     * 8. 리턴 뙇!!
     */
    try {
      const {userOId} = jwtPayload

      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. payload 와 유저 일치하나 췍!!
      if (jwtPayload.userOId !== userOId) {
        throw {gkd: {userOId: `유저 고유번호가 이상해요`}, gkdErr: `유저 고유번호 오류`, gkdStatus: {userOId}, where}
      }

      // 3. 채팅방 존재여부 췍!!
      const {chatRoom} = await this.dbHubService.readChatRoomByChatRoomOId(where, chatRoomOId)
      if (!chatRoom) {
        throw {gkd: {chatRoomOId: `존재하지 않는 채팅방입니다.`}, gkdErr: `채팅방 조회 안됨`, gkdStatus: {chatRoomOId}, where}
      }

      // 4. 채팅방의 유저인지 췍!!
      if (!chatRoom.userOIdsArr.includes(userOId)) {
        throw {gkd: {userOId: `권한이 없는 유저입니다.`}, gkdErr: `권한 오류`, gkdStatus: {userOId: jwtPayload.userOId}, where}
      }

      // 5. 채팅방 행 생성 위한 타겟 유저 뙇!!
      const {targetUserOId} = chatRoom
      const {user: targetUser} = await this.dbHubService.readUserByUserOId(where, targetUserOId)
      if (!targetUser) {
        throw {gkd: {targetUserOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {targetUserOId}, where}
      }

      // 6. 안 읽은 메시지 뙇!!
      const {unreadCount} = await this.dbHubService.readChatRoomUnreadCount(where, userOId, chatRoomOId)

      // 7. 채팅방 행 생성 뙇!!
      const chatRoomRow: T.ChatRoomRowType = {
        chatRoomOId,
        chatRoomName: targetUser.userName,
        targetUserOId: targetUser.userOId,
        lastChatDate: chatRoom.lastChatDate,
        unreadCount,
        targetUserId: targetUser.userId,
        targetUserName: targetUser.userName
      }

      // 8. 리턴 뙇!!
      return {chatRoomRow}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async getChatRoomRowArr(jwtPayload: T.JwtPayloadType, userOId: string) {
    const where = '/client/userInfo/getChatRoomRowArr'
    /**
     * userOId 의 채팅방 행 배열을 리턴한다.
     *
     * 1. 권한 췍!!
     * 2. payload 와 유저 일치하나 췍!!
     * 3. 유저 있나 췍!!
     * 4. 채팅방 배열 뙇!!
     * 5. 채팅방 행 배열 뙇!!
     * 6. 리턴 뙇!!
     */
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. payload 와 유저 일치하나 췍!!
      if (jwtPayload.userOId !== userOId) {
        throw {gkd: {userOId: `유저 고유번호가 이상해요`}, gkdErr: `유저 고유번호 오류`, gkdStatus: {userOId}, where}
      }

      // 3. 유저 있나 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {userOId}, where}
      }

      // 4. 채팅방 배열 뙇!!
      const {chatRoomArr} = await this.dbHubService.readChatRoomActiveArr(where, userOId)

      // 5. 채팅방 행 배열 뙇!!
      const chatRoomRowArr: T.ChatRoomRowType[] = await Promise.all(
        chatRoomArr.map(async chatRoom => {
          const {chatRoomOId, targetUserOId, lastChatDate, unreadCount, targetUserId} = chatRoom
          const {user} = await this.dbHubService.readUserByUserOId(where, targetUserOId)
          if (!user) {
            throw {gkd: {targetUserOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {targetUserOId}, where}
          }
          return {
            chatRoomOId,
            chatRoomName: user.userName,
            targetUserId,
            targetUserName: user.userName,
            targetUserOId,
            lastChatDate,
            unreadCount
          }
        })
      )

      // 6. 리턴 뙇!!
      return {chatRoomRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async getNewAlarmArrLen(jwtPayload: T.JwtPayloadType, userOId: string) {
    /**
     * userOId 의 수신 확인이 안 된 알람 갯수를 리턴한다.
     *
     * 1. 권한 췍!!
     * 2. payload 와 유저 일치하나 췍!!
     * 3. 유저 있나 췍!!
     * 4. 수신 확인이 안 된 알람 갯수 뙇!!
     * 5. 리턴 뙇!!
     */
    const where = '/client/userInfo/getNewAlarmArrLen'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. payload 와 유저 일치하나 췍!!
      if (jwtPayload.userOId !== userOId) {
        throw {gkd: {userOId: `유저 고유번호가 이상해요`}, gkdErr: `유저 고유번호 오류`, gkdStatus: {userOId}, where}
      }

      // 3. 유저 있나 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {userOId}, where}
      }

      // 4. 수신 확인이 안 된 알람 갯수 뙇!!
      const {alarmArr} = await this.dbHubService.readAlarmArrNotReceived(where, userOId)
      const newAlarmArrLen = alarmArr.length

      // 5. 리턴 뙇!!
      return {newAlarmArrLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  async openUserChatRoom(jwtPayload: T.JwtPayloadType, targetUserOId: string) {
    const where = '/client/userInfo/openUserChatRoom'
    /**
     * targetUserOId 를 이용하여 채팅방을 열려는 시도를 할 때 호출.
     * 유저 채팅방이 읽거나 생성하고 채팅방 정보를 리턴한다.
     *
     * 1. 권한 췍!!
     * 2. 유저 존재여부 췍!!
     * 3. 채팅방 생성 락 뙇!!
     * 4. 채팅방 존재여부 췍!! 없으면 생성 뙇!!
     * 5. 채팅방 행 배열 뙇!!
     * 6. 리턴 뙇!!
     */
    let lockUser = ''
    let lockTargetUser = ''
    try {
      const {userOId} = jwtPayload

      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_USER)

      // 2. userOId 가 같은지 췍!!
      if (userOId === targetUserOId) {
        throw {gkd: {userOId: `유저 고유번호가 이상해요`}, gkdErr: `유저 고유번호 오류`, gkdStatus: {userOId}, where}
      }

      // 3. 유저 존재여부 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      if (!user) {
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {userOId}, where}
      }
      const {user: targetUser} = await this.dbHubService.readUserByUserOId(where, targetUserOId)
      if (!targetUser) {
        throw {gkd: {targetUserOId: `존재하지 않는 대상 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {targetUserOId}, where}
      }

      // 3. 채팅방 생성 락 뙇!!
      lockUser = await this.lockService.readyLock(`createChatRoom_${userOId}`)
      lockTargetUser = await this.lockService.readyLock(`createChatRoom_${targetUserOId}`)

      // 4. 채팅방 존재여부 췍!! 없으면 생성 뙇!!
      let chatRoom: T.ChatRoomType = null

      const {chatRoom: isExist} = await this.dbHubService.readChatRoomByUserOIds(
        where,
        userOId,
        targetUserOId,
        targetUser.userName,
        targetUser.userId
      )
      if (isExist) {
        chatRoom = isExist
        const {chatRoomOId} = chatRoom
        await this.dbHubService.updateChatRoomResetUnreadCnt(where, userOId, chatRoomOId)
      } // ::
      else {
        const {chatRoom: newChatRoom} = await this.dbHubService.createChatRoom(where, userOId, targetUserOId, targetUser.userName, targetUser.userId)
        chatRoom = newChatRoom
      }
      const {chatRoomOId} = chatRoom

      // 5. 채팅방 행 배열 뙇!!
      const {chatRoomArr} = await this.dbHubService.readChatRoomActiveArr(where, userOId)

      const chatRoomRowArr: T.ChatRoomRowType[] = await Promise.all(
        chatRoomArr.map(async chatRoom => {
          // 채팅방 이름, 마지막 채팅 날짜(정렬용)를 가져오기 위해 이렇게까지 했다.
          const {chatRoomOId, targetUserOId, lastChatDate, unreadCount, targetUserId} = chatRoom
          const {user} = await this.dbHubService.readUserByUserOId(where, targetUserOId)
          if (!user) {
            throw {gkd: {targetUserOId: `존재하지 않는 유저입니다.`}, gkdErr: `유저 조회 안됨`, gkdStatus: {targetUserOId}, where}
          }
          return {
            chatRoomOId,
            chatRoomName: user.userName,
            targetUserId,
            targetUserName: user.userName,
            targetUserOId,
            lastChatDate,
            unreadCount
          }
        })
      )
      chatRoomRowArr.sort((a, b) => {
        // 가장 최근에 변경된걸 0번째로 둔다.
        if (a.lastChatDate && b.lastChatDate) {
          return b.lastChatDate.getTime() - a.lastChatDate.getTime()
        }
        return 0
      })

      // 6. 리턴 뙇!!
      return {chatRoomOId, chatRoomRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      // 락을 해제해줘야 한다.
      if (lockUser) {
        this.lockService.releaseLock(lockUser)
      }
      if (lockTargetUser) {
        this.lockService.releaseLock(lockTargetUser)
      }
      // ::
    }
  }

  // AREA6: 기타 영역

  async RESET_DIRECTORY(where: string, dirOId: string, directory: T.DirectoryType) {
    try {
      await this.dbHubService.updateDirectory(where, dirOId, directory)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async RESET_FILE(where: string, fileOId: string, file: T.FileType) {
    try {
      await this.dbHubService.updateFile(where, fileOId, file)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async GET_ENTIRE_DIRECTORY_INFO(where: string) {
    try {
      const {extraDirs, extraFiles} = await this._getExtrasRecursively(where)
      return {extraDirs, extraFiles}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  private async _deleteDirRecursively(where: string, dirOId: string, recurseLevel: number = 0) {
    where = where + `_deleteDirRecursively_${recurseLevel}`
    try {
      const {directory} = await this.dbHubService.readDirectoryByDirOId(where, dirOId)
      if (!directory) {
        return
      }

      // 1. 자식 폴더부터 지운다.
      const {subDirOIdsArr, fileOIdsArr} = directory
      await Promise.all(
        subDirOIdsArr.map(async (subDirOId: string) => {
          await this._deleteDirRecursively(where, subDirOId, recurseLevel + 1)
        })
      )

      // 2. 자식 파일들 지운다.
      await Promise.all(
        fileOIdsArr.map(async (fileOId: string) => {
          await this.dbHubService.deleteFile(where, fileOId)
        })
      )

      // 3. 자신을 지운다.
      await this.dbHubService.deleteDirectory(where, dirOId)
      return
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  /**
   * 잔체 폴더, 파일에 대해서 {extraDirs, extraFiles} 를 리턴한다.
   *  - root 폴더부터 재귀적으로 호출된다.
   *
   * @param where
   * @param dirOId : 루트를 호출하는경우 비워둔다.
   * @returns 비재귀: dirOId 폴더 정보 + 자식파일 정보
   *          재귀: 자식폴더와 자식폴더의 자식파일 정보
   */
  private async _getExtrasRecursively(where: string, dirOId?: string) {
    try {
      /**
       * 1. dirOId 존재 여부에 따라서 루트 폴더나 해당 폴더를 가져온다.
       * 2. dirOId 폴더 정보를 extraDirs 에 추가한다.
       * 3. dirOId 폴더의 자식파일 정보를 extraFiles 에 추가한다.
       * 4. dirOId 폴더의 자식폴더에 대해서 재귀적으로 호출한다.
       * 5. 재귀적으로 호출한 결과를 extraDirs 와 extraFiles 에 추가한다.
       */
      let directory: T.DirectoryType

      // 1. dirOId 존재 여부에 따라서 루트 폴더나 해당 폴더를 가져온다.
      if (dirOId) {
        directory = (await this.dbHubService.readDirectoryByDirOId(where, dirOId)).directory
      } // ::
      else {
        directory = (await this.dbHubService.readDirectoryRoot(where)).rootDir
      }

      // 2. extraDirs 와 extraFiles 를 초기화한다.
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [directory.dirOId],
        directories: {[directory.dirOId]: directory}
      }

      // 3. extraFiles 를 초기화한다. (순서가 중요하기에 for 문 사용)
      const extraFiles: T.ExtraFileRowObjectType = {
        fileOIdsArr: [],
        fileRows: {}
      }
      const fileLen = directory.fileOIdsArr.length
      for (let i = 0; i < fileLen; i++) {
        const fileOId = directory.fileOIdsArr[i]
        const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
        extraFiles.fileOIdsArr.push(fileOId)
        extraFiles.fileRows[fileOId] = file
      }

      // 4. 자식폴더에 대해서 재귀적으로 호출한다.
      // 5. 재귀적으로 호출한 결과를 extraDirs 와 extraFiles 에 추가한다.
      const subLen = directory.subDirOIdsArr.length
      for (let i = 0; i < subLen; i++) {
        // 순서가 중요하기에 for문으로 처리한다.
        const subDirOId = directory.subDirOIdsArr[i]
        const {extraDirs: _dirs, extraFiles: _files} = await this._getExtrasRecursively(where, subDirOId)
        extraDirs.dirOIdsArr.push(..._dirs.dirOIdsArr)
        Object.values(_dirs.directories).forEach((directory: T.DirectoryType) => {
          extraDirs.directories[directory.dirOId] = directory
        })
        extraFiles.fileOIdsArr.push(..._files.fileOIdsArr)
        Object.values(_files.fileRows).forEach((file: T.FileType) => {
          extraFiles.fileRows[file.fileOId] = file
        })
      }

      return {extraDirs, extraFiles}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
}
