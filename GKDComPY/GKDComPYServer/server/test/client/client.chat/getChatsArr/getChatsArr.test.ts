import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../_common'
import {ReadMyBlockedChat, ReadMyChat, ReadOtherChat} from './tests'

const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class GetChatsArr extends GKDTestBase {
  private testReadMyChat: ReadMyChat
  private testReadMyBlockedChat: ReadMyBlockedChat
  private testReadOtherChat: ReadOtherChat

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.testReadMyChat = new ReadMyChat(REQUIRED_LOG_LEVEL + 1)
    this.testReadMyBlockedChat = new ReadMyBlockedChat(REQUIRED_LOG_LEVEL + 1)
    this.testReadOtherChat = new ReadOtherChat(REQUIRED_LOG_LEVEL + 1)
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
      await this.testReadMyChat.testOK(db, logLevel)
      await this.testReadMyBlockedChat.testFail(db, logLevel)
      await this.testReadOtherChat.testFail(db, logLevel)
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
  const testModule = new GetChatsArr(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
