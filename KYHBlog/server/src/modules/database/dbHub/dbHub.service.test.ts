import {CommentDBServiceTest} from '../_tables/commentDB'
import {DirectoryDBServiceTest} from '../_tables/directoryDB'
import {FileDBServiceTest} from '../_tables/fileDB'
import {UserDBServiceTest} from '../_tables/userDB'
import {DBHubService} from './dbHub.service'

export class DBHubServiceTest {
  private static commentDBService = CommentDBServiceTest.commentDBService
  private static dirDBService = DirectoryDBServiceTest.directoryDBService
  private static fileDBService = FileDBServiceTest.fileDBService
  private static userDBService = UserDBServiceTest.userDBService

  public static dbHubService = new DBHubService(
    DBHubServiceTest.commentDBService,
    DBHubServiceTest.dirDBService,
    DBHubServiceTest.fileDBService,
    DBHubServiceTest.userDBService
  )
}
