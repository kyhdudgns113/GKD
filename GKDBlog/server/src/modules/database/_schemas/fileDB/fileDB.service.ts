import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {FileDB} from './fileDB.entity'
import {FileType} from 'src/common/types'

@Injectable()
export class FileDBService {
  constructor(@InjectModel(FileDB.name) private fileModel: Model<FileDB>) {}

  async createFile(where: string, name: string) {
    where = where + '/createFile'
    try {
      const newFile = new this.fileModel({name})
      const fileDB = await newFile.save()

      const {contentsArr, _id} = fileDB
      const fileOId = _id.toString()
      const file: FileType = {fileOId, name, contentsArr}
      return {file}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
}
