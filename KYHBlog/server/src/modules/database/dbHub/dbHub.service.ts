import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as DB from '../_tables'

/**
 * 이곳은 거의 대부분 Schema 의 함수랑 결과를 그대로 보내주는 역할만 한다.
 *
 * 이것들은 port 에서 해줘야 한다.
 * - 인자의 Error 체크
 * - 권한 체크 함수 실행
 *    - port 에서 db 접근할때마다 권한체크하면 오버헤드 심해진다.
 *
 * 이건 여기서 해준다.
 * - 권한 체크 함수 작성
 */
@Injectable()
export class DBHubService {
  constructor(
    private readonly dirDBService: DB.DirectoryDBService,
    private readonly fileDBService: DB.FileDBService,
    private readonly userDBService: DB.UserDBService
  ) {}

  // AREA1: DirectoryDB Area
  async createDirRoot(where: string) {
    try {
      const {directory} = await this.dirDBService.createDirRoot(where)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readDirArrByParentDirOId(where: string, parentDirOId: string) {
    try {
      const {directoryArr} = await this.dirDBService.readDirArrByParentDirOId(where, parentDirOId)
      return {directoryArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirRoot(where: string) {
    try {
      const {directory} = await this.dirDBService.readDirRoot(where)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA2: FileDB Area
  async readFileRowArrByDirOId(where: string, dirOId: string) {
    try {
      const {fileRowArr} = await this.fileDBService.readFileRowArrByDirOId(where, dirOId)
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA3: UserDB Area
  async createUser(where: string, dto: DTO.SignUpDTO) {
    try {
      const {user} = await this.userDBService.createUser(where, dto)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readUserByUserIdAndPassword(where: string, userId: string, password: string) {
    try {
      const {user} = await this.userDBService.readUserByUserIdAndPassword(where, userId, password)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserOId(where: string, userOId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserOId(where, userOId)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA6: CheckAuth
}
