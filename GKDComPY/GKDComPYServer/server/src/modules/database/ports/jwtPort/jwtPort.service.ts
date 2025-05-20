import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'

@Injectable()
export class JwtPortService {
  constructor(private readonly dbHubService: DatabaseHubService) {}

  /**
   * 여기서는 권한 체크를 안한다 \
   * 권한이 있는지 확인하는곳에서 DB 접근을 할 수 있냐고 물어보는건 이상한 짓이다
   */
  async checkUserAdmin(uOId: string) {
    const where = '/guard/checkUserAdmin'
    try {
      const {user} = await this.dbHubService.readUserByUOId(where, uOId)
      if (!user) {
        throw {gkd: {user: '관리자 권한을 체크할 유저가 없습니다'}, gkdStatus: {uOId}, where}
      }
      if (user.id !== 'GKD_Master') {
        throw {gkd: {admin: '해당 유저는 관리자 권한이 없습니다.'}, gkdStatus: {id: user.id}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
