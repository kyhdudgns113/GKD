import {DBServiceTest} from '../_db'
import {FileDBService} from './fileDB.service'

export class FileDBServiceTest {
  private dbService = DBServiceTest.dbService

  public fileDBService = new FileDBService(this.dbService)
}
