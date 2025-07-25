import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {JwtPayloadType} from '../../../../../../src/common/types'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

export class ReadMyBlockedChat extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService
  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const commIdx = 0
      const userIdx = 0
      const clubIdx = 0
      const {club} = this.testDB.readClub(commIdx, clubIdx)
      const {clubOId} = club
      const {user} = this.testDB.readUser(commIdx, userIdx)

      const jwtPayload: JwtPayloadType = user

      await this.portService.getChatsArr(jwtPayload, clubOId, 0)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new ReadMyBlockedChat(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
