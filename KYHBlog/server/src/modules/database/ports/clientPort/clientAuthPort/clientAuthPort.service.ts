import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'

@Injectable()
export class ClientAuthPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  async logIn(data: HTTP.LogInDataType) {
    const where = `/client/auth/logIn`
    /**
     * 1. 입력값 췍!!
     *  1-1. userId 길이 체크
     *  1-2. password 길이 체크
     *  1-3. password 형식 체크
     *
     * 2. DB 에서 유저정보 조회 뙇!!
     * 3. 로그인 실패했으면 에러 뙇!!
     * 4. 리턴 뙇!!
     */
    const {userId, password} = data

    try {
      // 1-1. 입력값 체크: userId 길이
      if (!userId || userId.length < 6 || userId.length > 20) {
        throw {
          gkd: {userId: `userId 길이 오류. ${userId.length}가 들어옴`},
          gkdErrMsg: `userId 는 6자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId},
          httpStatus: 400,
          where
        }
      }

      // 1-2. 입력값 체크: password 길이
      if (!password || password.length < 8 || password.length > 20) {
        throw {
          gkd: {password: `password 길이 오류. ${password.length}가 들어옴`},
          gkdErrMsg: `password 는 8자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId},
          httpStatus: 400,
          where
        }
      }

      // 1-3. 입력값 체크: password 형식
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {
          gkd: {password: `password 형식 오류`},
          gkdErrMsg: `password 는 영문 대소문자, 숫자, 특수문자를 각각 포함하여 8자 이상으로 입력해주세요.`,
          gkdStatus: {userId},
          httpStatus: 400,
          where
        }
      }

      // 2. DB 에서 유저정보 조회 뙇!!
      const {user} = await this.dbHubService.readUserByUserIdAndPassword(where, userId, password)

      // 3. 로그인 실패했으면 에러 뙇!!
      if (!user) {
        throw {
          gkd: {logIn: `로그인 실패`},
          gkdErrMsg: `아이디 또는 비밀번호가 일치하지 않습니다.`,
          gkdStatus: {userId},
          httpStatus: 400,
          where
        }
      }

      // 4. 리턴 뙇!!
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async signUp(data: HTTP.SignUpDataType) {
    const where = `/client/auth/signUp`
    /**
     * 1. 입력값 췍!!
     *  1-1. userId 길이 체크
     *  1-2. userName 길이 체크
     *  1-3. password 길이 체크
     *  1-4. password 형식 체크
     *
     * 2. dto 생성 뙇!!
     * 3. DB 에 추가 뙇!!
     * 4. 리턴 뙇!!
     */
    try {
      const {userId, userName, password} = data

      // 1-1. 입력값 체크: userId
      if (!userId || userId.length < 6 || userId.length > 20) {
        throw {
          gkd: {userId: `userId 길이 오류. ${userId.length}가 들어옴`},
          gkdErrMsg: `userId 는 6자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId, userName},
          httpStatus: 400,
          where
        }
      }

      // 1-2. 입력값 체크: userName
      if (!userName || userName.length < 2 || userName.length > 10) {
        throw {
          gkd: {userName: `userName 길이 오류. ${userName.length}가 들어옴`},
          gkdErrMsg: `userName 는 2자 이상 10자 이하여야 합니다.`,
          gkdStatus: {userId, userName},
          httpStatus: 400,
          where
        }
      }

      // 1-3. 입력값 체크: password 길이
      if (!password || password.length < 8 || password.length > 20) {
        throw {
          gkd: {password: `password 길이 오류. ${password.length}가 들어옴`},
          gkdErrMsg: `password 는 8자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId, userName},
          httpStatus: 400,
          where
        }
      }

      // 1-4. 입력값 체크: password 형식
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw {
          gkd: {password: `password 형식 오류`},
          gkdErrMsg: `password 는 영문 대소문자, 숫자, 특수문자를 각각 포함하여 8자 이상으로 입력해주세요.`,
          gkdStatus: {userId, userName},
          httpStatus: 400,
          where
        }
      }

      // 2. dto 생성 뙇!!
      const dto: DTO.SignUpDTO = {
        userId,
        userName,
        password,
        picture: null,
        signUpType: 'common'
      }

      // 3. DB 에 추가 뙇!!
      const {user} = await this.dbHubService.createUser(where, dto)

      // 4. 리턴 뙇!!
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
