import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {FileDB} from './fileDB.entity'
import {FileType} from 'src/common/types'

@Injectable()
export class FileDBService {
  constructor(@InjectModel(FileDB.name) private fileModel: Model<FileDB>) {}

  async createFile(where: string, parentDirOId: string, name: string) {
    where = where + '/createFile'
    try {
      const newFile = new this.fileModel({name, parentDirOId})
      const fileDB = await newFile.save()

      const {contentsArr, _id} = fileDB
      const fileOId = _id.toString()
      const file: FileType = {fileOId, name, contentsArr, parentDirOId}
      return {file}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async readFileByFileOId(where: string, fileOId: string) {
    where = where + '/readFileByFileOId'
    try {
      const _id = new Types.ObjectId(fileOId)
      const fileDB = await this.fileModel.findById(_id)

      // 파일 없으면 null 리턴한다.
      if (!fileDB) {
        return {file: null}
      }
      const {contentsArr, name, parentDirOId} = fileDB
      const file: FileType = {fileOId, name, contentsArr, parentDirOId}
      return {file}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async readFileByParentAndName(where: string, parentDirOId: string, fileName: string) {
    where = where + '/readFileByParentAndName'
    try {
      const fileDB = await this.fileModel.findOne({parentDirOId, name: fileName})

      // 파일 없으면 null 리턴한다.
      if (!fileDB) {
        return {file: null}
      }

      const {_id, name, contentsArr} = fileDB
      const fileOId = _id.toString()
      const file: FileType = {fileOId, name, contentsArr, parentDirOId}
      return {file}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async deleteFile(where: string, fileOId: string) {
    where = where + '/deleteFile'
    try {
      const _id = new Types.ObjectId(fileOId)
      await this.fileModel.findByIdAndDelete(_id)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
}
