import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {DirectoryDB} from './directoryDB.entity'
import {Model, Types} from 'mongoose'
import {DirectoryType} from 'src/common/types'

@Injectable()
export class DirectoryDBService {
  constructor(@InjectModel(DirectoryDB.name) private directoryModel: Model<DirectoryDB>) {}

  async createDirectory(where: string, parentDirOId: string, dirName: string) {
    where = where + '/createDirectory'

    try {
      const dirDB = await this.directoryModel.create({dirName, parentDirOId})
      await dirDB.save()

      const {_id, fileOIdsArr, subDirOIdsArr} = dirDB
      const dirOId = _id.toString()

      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async createDirectoryRoot(where: string) {
    where = where + '/createDirectoryRoot'

    try {
      const dirDB = await this.directoryModel.create({dirName: 'root', parentDirOId: 'NULL'})
      await dirDB.save()

      const {_id, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const dirOId = _id.toString()

      const rootDir: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {rootDir}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async readDirectoryByDirOId(where: string, dirOId: string) {
    where = where + '/readDirectoryByDirOId'

    try {
      const _id = new Types.ObjectId(dirOId)
      const dirDB = await this.directoryModel.findOne({_id})
      if (!dirDB) {
        return {directory: null}
      }

      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async readDirectoryByParentAndName(where: string, parentDirOId: string, dirName: string) {
    where = where + '/readDirectoryByParentAndName'

    try {
      const dirDB = await this.directoryModel.findOne({dirName, parentDirOId})
      if (!dirDB) {
        return {directory: null}
      }

      const {_id, fileOIdsArr, subDirOIdsArr} = dirDB
      const dirOId = _id.toString()
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async readDirectoryRoot(where: string) {
    where = where + '/readDirectoryRoot'

    try {
      const dirDB = await this.directoryModel.findOne({dirName: 'root'})
      if (!dirDB) {
        return {rootDir: null}
      }

      const {_id, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const dirOId = _id.toString()

      const rootDir: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {rootDir}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async updateDirectoryName(where: string, dirOId: string, newDirName: string) {
    where = where + '/updateDirectoryName'

    try {
      const _id = new Types.ObjectId(dirOId)
      const result = await this.directoryModel.updateOne({_id}, {$set: {dirName: newDirName}})

      /**
       * 이름이 바뀌지 않아도 정상작동 해야한다.
       * - 그래야 하위 폴더나 파일들의 정보를 넘겨줄 수 있다.
       */
      // if (result.modifiedCount === 0) {
      //   throw {
      //     gkd: {dirOId: `존재하지 않는 디렉토리입니다.`},
      //     gkdErr: '존재하지 않는 디렉토리 업데이트 시도',
      //     gkdStatus: {dirOId, newDirName},
      //     where
      //   }
      // }

      const dirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryPushBackDir(where: string, dirOId: string, newSubDirOId: string) {
    where = where + '/updateDirectoryPushBackDir'

    try {
      const _id = new Types.ObjectId(dirOId)
      const result = await this.directoryModel.updateOne({_id}, {$push: {subDirOIdsArr: newSubDirOId}})
      if (result.modifiedCount === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리입니다.`},
          gkdErr: '존재하지 않는 디렉토리 업데이트 시도',
          gkdStatus: {dirOId, newSubDirOId},
          where
        }
      }

      const dirDB = await this.directoryModel.findOne({_id})

      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryPushBackFile(where: string, dirOId: string, fileOId: string) {
    where = where + '/updateDirectoryPushBackFile'

    try {
      const _id = new Types.ObjectId(dirOId)
      const result = await this.directoryModel.updateOne({_id}, {$push: {fileOIdsArr: fileOId}})
      if (result.modifiedCount === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리입니다.`},
          gkdErr: '존재하지 않는 디렉토리 업데이트 시도',
          gkdStatus: {dirOId, fileOId},
          where
        }
      }

      const dirDB = await this.directoryModel.findOne({_id})

      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryRemoveSubDir(where: string, dirOId: string, subDirOId: string) {
    where = where + '/updateDirectoryRemoveSubDir'

    try {
      const _id = new Types.ObjectId(dirOId)
      const result = await this.directoryModel.updateOne({_id}, {$pull: {subDirOIdsArr: subDirOId}})
      if (result.modifiedCount === 0) {
        throw {gkd: {dirOId: `존재하지 않는 디렉토리입니다.`}, gkdErr: `존재하지 않는 디렉토리 삭제시도`, gkdStatus: {dirOId, subDirOId}, where}
      }

      const dirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryRemoveSubFile(where: string, dirOId: string, fileOId: string) {
    where = where + '/updateDirectoryRemoveSubFile'

    try {
      const _id = new Types.ObjectId(dirOId)
      const result = await this.directoryModel.updateOne({_id}, {$pull: {fileOIdsArr: fileOId}})
      if (result.modifiedCount === 0) {
        throw {gkd: {dirOId: `존재하지 않는 디렉토리입니다.`}, gkdErr: `존재하지 않는 디렉토리 삭제시도`, gkdStatus: {dirOId, fileOId}, where}
      }

      const dirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = dirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }

  async deleteDirectory(where: string, dirOId: string) {
    where = where + '/deleteDirectory'

    try {
      const _id = new Types.ObjectId(dirOId)
      const result = await this.directoryModel.deleteOne({_id})
      if (result.deletedCount === 0) {
        throw {gkd: {dirOId: `존재하지 않는 디렉토리입니다.`}, gkdErr: `존재하지 않는 디렉토리 삭제시도`, gkdStatus: {dirOId}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
}
