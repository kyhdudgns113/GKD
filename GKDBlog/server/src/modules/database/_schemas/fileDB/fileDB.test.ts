import {model} from 'mongoose'
import {FileDBService} from './fileDB.service'
import {CommentDB, CommentDBSchema, FileDB, FileDBSchema} from './fileDB.entity'

export class FileDBServiceTest {
  private fileModel = model(FileDB.name, FileDBSchema)
  private commentModel = model(CommentDB.name, CommentDBSchema)

  public fileDBService = new FileDBService(this.commentModel, this.fileModel)
}
