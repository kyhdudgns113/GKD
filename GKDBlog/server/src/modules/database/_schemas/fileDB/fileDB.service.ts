import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {FileDB} from './fileDB.entity'

import * as T from '@common/types'

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
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId}
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
      const fileDB = await this.fileModel.findOne({_id})

      // 파일 없으면 null 리턴한다.
      if (!fileDB) {
        return {file: null}
      }
      const {contentsArr, name, parentDirOId} = fileDB
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId}
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
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId}
      return {file}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async updateFile(where: string, fileOId: string, file: T.FileType) {
    where = where + '/updateFile'
    try {
      const _id = new Types.ObjectId(fileOId)
      const {name, contentsArr, parentDirOId} = file
      await this.fileModel.updateOne({_id}, {$set: {name, contentsArr, parentDirOId}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async updateFileNameAndContents(where: string, fileOId: string, newName: string, newContentsArr: T.ContentType[]) {
    where = where + '/updateFileNameAndContents'
    try {
      const _id = new Types.ObjectId(fileOId)
      const fileDB = await this.fileModel.findByIdAndUpdate(_id, {$set: {name: newName, contentsArr: newContentsArr}})

      const {name, contentsArr, parentDirOId} = fileDB
      const file: T.FileType = {fileOId, name, contentsArr, parentDirOId}
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
