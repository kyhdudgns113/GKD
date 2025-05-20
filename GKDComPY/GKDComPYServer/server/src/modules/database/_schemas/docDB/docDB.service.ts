import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {GDocument} from './docDB.entity'

@Injectable()
export class GDocumentDBService {
  constructor(@InjectModel(GDocument.name) private docModel: Model<GDocument>) {}

  async createDoc(where: string, clubOId: string) {
    try {
      const newDoc = new this.docModel({clubOId})
      const doc = await newDoc.save()
      return {doc}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readDocContentsByClubOId(where: string, clubOId: string) {
    where = where + '/readDocContentsByClubOId'
    try {
      const docDB = await this.docModel.findOne({clubOId})
      if (!docDB) throw {gkd: {etc: '문서가 없어요.'}, gkdStatus: {clubOId}, where}

      const {contents} = docDB
      return {contents}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateDocumentWithClubOId(where: string, clubOId: string, contents: string[]) {
    try {
      await this.docModel.updateOne({clubOId}, {contents})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteDocByClubOId(where: string, clubOId: string) {
    try {
      await this.docModel.deleteMany({clubOId})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
