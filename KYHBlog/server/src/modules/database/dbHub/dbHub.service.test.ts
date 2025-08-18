import {DirectoryDBServiceTest} from '../_tables/directoryDB'
import {FileDBServiceTest} from '../_tables/fileDB'
import {UserDBServiceTest} from '../_tables/userDB'
import {DBHubService} from './dbHub.service'

export class DBHubServiceTest {
  private static dirDBService = new DirectoryDBServiceTest().directoryDBService
  private static fileDBService = new FileDBServiceTest().fileDBService
  private static userDBService = new UserDBServiceTest().userDBService

  public static dbHubService = new DBHubService(this.dirDBService, this.fileDBService, this.userDBService)
}
