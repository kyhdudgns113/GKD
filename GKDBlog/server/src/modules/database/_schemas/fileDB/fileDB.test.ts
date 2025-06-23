import {model} from 'mongoose'
import {FileDBService} from './fileDB.service'
import {CommentDB, CommentDBSchema, FileDB, FileDBSchema} from './fileDB.entity'

export class FileDBServiceTest {
  private commentModel = model(CommentDB.name, CommentDBSchema)
  private fileModel = model(FileDB.name, FileDBSchema)

  public fileDBService = new FileDBService(this.commentModel, this.fileModel)
}
