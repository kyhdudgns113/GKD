import {model} from 'mongoose'
import {DirectoryDB, DirectoryDBSchema} from './directoryDB.entity'
import {DirectoryDBService} from './directoryDB.service'

export class DirectoryDBServiceTest {
  private directoryModel = model(DirectoryDB.name, DirectoryDBSchema)

  public directoryService = new DirectoryDBService(this.directoryModel)
}
