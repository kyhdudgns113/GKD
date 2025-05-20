import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub'
import {gkdSaltOrRounds} from 'src/common/secret'

import * as bcrypt from 'bcrypt'
import * as T from 'src/common/types/types'

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
        throw {gkd: {userId: `아이디는 6자 이상 16자 이하로 입력해주세요.`}, gkdStatus: {userId}, where}
      }

      // 비밀번호 길이 췍!!
      if (password.length < 8 || password.length > 20) {
        throw {gkd: {password: `비밀번호는 8자 이상 20자 이하로 입력해주세요.`}, gkdStatus: {userId}, where}
      }

      // 비밀번호 형식 췍!!
      if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {gkd: {password: `비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상으로 입력해주세요.`}, gkdStatus: {userId}, where}
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
        throw {gkd: {userId: `아이디는 6자 이상 16자 이하로 입력해주세요.`}, gkdStatus: {userId, userName}, where}
      }

      // 유저 이름 길이 췍!!
      if (userName.length < 2 || userName.length > 12) {
        throw {gkd: {userName: `이름은 2자 이상 12자 이하로 입력해주세요.`}, gkdStatus: {userId, userName}, where}
      }

      // 유저 아이디 중복 췍!!
      const {user: _isIdExist} = await this.dbHubService.readUserByUserId(where, userId)
      if (_isIdExist) {
        throw {gkd: {userId: `이미 존재하는 아이디입니다.`}, gkdStatus: {userId, userName}, where}
      }

      // 유저 이름 중복 췍!!
      const {user: _isNameExist} = await this.dbHubService.readUserByUserName(where, userName)
      if (_isNameExist) {
        throw {gkd: {userName: `이미 존재하는 이름입니다.`}, gkdStatus: {userId, userName}, where}
      }

      // 비밀번호 길이 췍!!
      if (password.length < 8 || password.length > 20) {
        throw {gkd: {password: `비밀번호는 8자 이상 20자 이하로 입력해주세요.`}, gkdStatus: {userId, userName}, where}
      }

      // 비밀번호 형식 췍!!
      if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {gkd: {password: `비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상으로 입력해주세요.`}, gkdStatus: {userId, userName}, where}
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
          throw {gkd: {userId: `이 계정은 구글계정으로 가입하지 않았습니다.`}, gkdStatus: {userId, userName}, where}
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

  // AREA2: ClientAuth_토큰 필요 있는 함수들
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
        throw {gkd: {userOId: `존재하지 않는 유저입니다.`}, gkdStatus: {userName, userOId}, where}
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
}
