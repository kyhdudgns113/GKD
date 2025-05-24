import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub'
import {AUTH_ADMIN, gkdSaltOrRounds} from 'src/common/secret'

import * as bcrypt from 'bcrypt'
import * as T from 'src/common/types'
import * as HTTP from 'src/common/types/httpDataTypes'

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
  constructor(private readonly dbHubService: DatabaseHubService) {}

  // AREA1: ClientAuth_토큰 필요 없는 함수들
  async logIn(userId: string, password: string) {
    const where = '/client/auth/logIn'
    try {
      // 유저 아이디 길이 췍!!
      if (userId.length < 6 || userId.length > 16) {
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
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async signUp(userId: string, userName: string, password: string) {
    const where = '/client/auth/signUp'
    try {
      // 유저 아이디 길이 췍!!
      if (userId.length < 6 || userId.length > 16) {
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
      if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {
          gkd: {password: `비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상으로 입력해주세요.`},
          gkdErr: '',
          gkdStatus: {userId, userName},
          where
        }
      }

      const hashedPassword = await bcrypt.hash(password, gkdSaltOrRounds)
      const {user} = await this.dbHubService.createUser(where, userId, userName, hashedPassword)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
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
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
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
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  // AREA3: ClientPosting_토큰 필요없는 함수들
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
      await Promise.all(
        subDirOIdsArr.map(async subDirOId => {
          const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)
          // dirOId 여기서 넣어줘야 한다. dirOId 에 해당하는 폴더 없으면 전달 안해야 한다.
          extraDirs.dirOIdsArr.push(subDirOId)
          extraDirs.directories[subDirOId] = directory
        })
      )

      // 3. 파일들 정보: extraFileRows 뙇!!
      const {fileOIdsArr} = directory
      const extraFileRows: T.ExtraFileRowObjectType = {
        fileOIdsArr,
        fileRows: {}
      }
      await Promise.all(
        fileOIdsArr.map(async fileOId => {
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          extraFileRows.fileRows[fileOId] = file
        })
      )

      // 4. 리턴 뙇!!
      return {extraDirs, extraFileRows}
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async getRootDir() {
    const where = '/client/posting/getRootDir'
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

        // 들어가는 순서가 상관이 없어서 비동기로 처리한다
        await Promise.all(
          subDirOIdsArr.map(async subDirOId => {
            const {directory} = await this.dbHubService.readDirectoryByDirOId(where, subDirOId)

            // 1-1-1. 중간에 삭제됬을수도 있다
            //        결과값 리턴은 제대로 해야되므로 에러 출력은 하지 않는다
            if (directory) {
              extraDirs.dirOIdsArr.push(subDirOId)
              extraDirs.directories[subDirOId] = directory
            }
          })
        )

        // 1-2. 리턴용 extraFiles 뙇!!
        const fileRows: {[fileOId: string]: T.FileRowType} = {}
        for (const fileOId of fileOIdsArr) {
          const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)
          fileRows[fileOId] = {fileOId, name: file.name}
        }
        const extraFileRows: T.ExtraFileRowObjectType = {fileOIdsArr, fileRows}

        return {extraDirs, extraFileRows, rootDir: _rootDir}
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

      return {extraDirs, extraFileRows, rootDir}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  // AREA4: ClientPosting_토큰 필요한 함수들
  async addDirectory(jwtPayload: T.JwtPayloadType, data: HTTP.AddDirectoryDataType) {
    const where = '/client/posting/addDirectory'
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth(where, jwtPayload, AUTH_ADMIN)

      // 2. 부모 폴더 내에서 이름 중복 췍!!
      const {dirName, parentDirOId} = data
      const {directory: isExist} = await this.dbHubService.readDirectoryByParentAndName(where, parentDirOId, dirName)
      if (isExist) {
        throw {gkd: {dirName: `이미 존재하는 이름입니다.`}, gkdErr: '중복된 이름 디렉토리 생성시도도', gkdStatus: {dirName, parentDirOId}, where}
      }

      // 3. 폴더 생성 뙇!!
      const {directory} = await this.dbHubService.createDirectory(where, parentDirOId, dirName)
      const {dirOId} = directory

      // 4. 부모 폴더의 subDirOIdsArr 에 추가 뙇!!
      const {directory: parentDir} = await this.dbHubService.updateDirectoryPushBackDir(where, parentDirOId, dirOId)

      // 5. 리턴용 extraDirs 뙇!!
      const extraDirs: T.ExtraDirObjectType = {
        dirOIdsArr: [parentDirOId, dirOId],
        directories: {[parentDirOId]: parentDir, [dirOId]: directory}
      }

      // 6. 리턴용 extraFiles 뙇!!
      //    - 파일 추가를 한건 아니므로 빈 오브젝트를 리턴한다
      const extraFileRows: T.ExtraFileRowObjectType = {fileOIdsArr: [], fileRows: {}}

      // 7. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
}
