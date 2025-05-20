import {model} from 'mongoose'
import {FileDBService} from './fileDB.service'
import {FileDB, FileDBSchema} from './fileDB.entity'

export class FileDBServiceTest {
  private fileModel = model(FileDB.name, FileDBSchema)

  public fileDBService = new FileDBService(this.fileModel)
}
