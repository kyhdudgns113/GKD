import {DBServiceTest} from '../_db'
import {DirectoryDBService} from './directoryDB.service'

export class DirectoryDBServiceTest {
  private dbService = DBServiceTest.dbService

  public directoryDBService = new DirectoryDBService(this.dbService)
}
