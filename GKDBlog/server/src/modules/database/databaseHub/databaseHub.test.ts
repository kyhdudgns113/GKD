import {DatabaseHubService} from './databaseHub.service'
import * as T from '../_schemas'

export class DatabaseHubServiceTest {
  private readonly alarmDBServiceTest = new T.AlarmDBServiceTest()
  private readonly directoryDBServiceTest = new T.DirectoryDBServiceTest()
  private readonly fileDBServiceTest = new T.FileDBServiceTest()
  private readonly gkdLogDBServiceTest = new T.GKDLogDBServiceTest()
  private readonly userDBServiceTest = new T.UserDBServiceTest()

  public dbHubService = new DatabaseHubService(
    this.alarmDBServiceTest.alarmDBService,
    this.directoryDBServiceTest.directoryService,
    this.fileDBServiceTest.fileDBService,
    this.gkdLogDBServiceTest.logDBService,
    this.userDBServiceTest.userDBService
  )
}
