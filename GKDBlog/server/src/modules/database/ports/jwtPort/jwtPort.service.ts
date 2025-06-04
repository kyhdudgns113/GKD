import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub'
import {AUTH_ADMIN} from '@secret'

@Injectable()
export class JwtPortService {
  constructor(private readonly dbHubService: DatabaseHubService) {}

  /**
   * 여기서는 권한 체크를 안한다 \
   * 권한이 있는지 확인하는곳에서 DB 접근을 할 수 있냐고 물어보는건 이상한 짓이다
   */
  async checkUserAdmin(userId: string) {
    const where = '/guard/checkUserAdmin'
    try {
      const {userAuth} = await this.dbHubService.readUserAuthByUserId(where, userId)
      if (userAuth !== AUTH_ADMIN) {
        throw {gkd: {userAuth: '관리자만 가능합니다.'}, gkdStatus: {userAuth}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readUserAuthByUserId(userId: string) {
    const where = '/guard/readUserAuthByUserId'
    try {
      const {userAuth} = await this.dbHubService.readUserAuthByUserId(where, userId)
      return {userAuth}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
