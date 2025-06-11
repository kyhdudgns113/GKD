import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {DirectoryDB} from './directoryDB.entity'
import {Model, Types} from 'mongoose'
import {DirectoryType} from '@common/types'

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

  async updateDirectory(where: string, dirOId: string, directory: DirectoryType) {
    where = where + '/updateDirectory'

    try {
      const _id = new Types.ObjectId(dirOId)
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = directory

      await this.directoryModel.updateOne({_id}, {$set: {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryAddFile(where: string, dirOId: string, newFileOId: string, targetIdx: number) {
    where = where + '/updateDirectoryAddFile'

    try {
      const _id = new Types.ObjectId(dirOId)

      const dirDB = await this.directoryModel.findOne({_id})
      if (!dirDB) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리입니다.`},
          gkdErr: `존재하지 않는 디렉토리 업데이트 시도`,
          gkdStatus: {dirOId, newFileOId, targetIdx},
          where
        }
      }

      const {fileOIdsArr: prevArr} = dirDB
      const newFileOIdsArr = [...prevArr]

      if (newFileOIdsArr.includes(newFileOId)) {
        throw {
          gkd: {dirOId: `이미 존재하는 파일입니다.`},
          gkdErr: `이미 존재하는 파일 업데이트 시도`,
          gkdStatus: {dirOId, newFileOId, targetIdx},
          where
        }
      }

      if (targetIdx === null) {
        newFileOIdsArr.push(newFileOId)
      } // BLANK LINE COMMENT:
      else {
        newFileOIdsArr.splice(targetIdx, 0, newFileOId)
      }

      await this.directoryModel.updateOne({_id}, {$set: {fileOIdsArr: newFileOIdsArr}})

      const newDirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = newDirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryAddSubDir(where: string, parentDirOId: string, newSubDirOId: string, targetIdx: number) {
    /**
     * parentDirOId 에 newSubDirOId 를 targetIdx 번째에 추가한다.
     * - targetIdx 가 null 이면 맨 뒤에 추가한다.
     */
    where = where + '/updateDirectoryAddSubDir'

    try {
      const _id = new Types.ObjectId(parentDirOId)

      const dirDB = await this.directoryModel.findOne({_id})
      if (!dirDB) {
        throw {
          gkd: {parentDirOId: `존재하지 않는 디렉토리입니다.`},
          gkdErr: `존재하지 않는 디렉토리 업데이트 시도`,
          gkdStatus: {parentDirOId, newSubDirOId, targetIdx},
          where
        }
      }

      const {subDirOIdsArr: prevArr} = dirDB
      const newSubDirOIdsArr = [...prevArr]
      if (targetIdx === null) {
        newSubDirOIdsArr.push(newSubDirOId)
      } // BLANK LINE COMMENT:
      else {
        newSubDirOIdsArr.splice(targetIdx, 0, newSubDirOId)
      }

      await this.directoryModel.updateOne({_id}, {$set: {subDirOIdsArr: newSubDirOIdsArr}})

      const newDirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId: parentsParentDirOId, subDirOIdsArr} = newDirDB
      const dirOId = parentDirOId
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId: parentsParentDirOId, subDirOIdsArr}

      return {directory}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    }
  }
  async updateDirectoryFileSequence(where: string, dirOId: string, moveFileOId: string, targetIdx: number) {
    where = where + '/updateDirectoryFileSequence'

    try {
      const _id = new Types.ObjectId(dirOId)

      const dirDB = await this.directoryModel.findOne({_id})
      if (!dirDB) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리입니다.`},
          gkdErr: `존재하지 않는 디렉토리 업데이트 시도`,
          gkdStatus: {dirOId, moveFileOId, targetIdx},
          where
        }
      }
      const {fileOIdsArr: prevArr} = dirDB
      const newFileOIdsArr = [...prevArr]
      if (!newFileOIdsArr.includes(moveFileOId)) {
        throw {
          gkd: {moveFileOId: `배열에 존재하지 않는 파일입니다.`},
          gkdErr: `배열에 존재하지 않는 파일 업데이트 시도`,
          gkdStatus: {dirOId, moveFileOId, targetIdx},
          where
        }
      }

      // 배열 수정
      if (targetIdx === null) {
        newFileOIdsArr.push(moveFileOId)
      } // BLANK LINE COMMENT:
      else {
        newFileOIdsArr.splice(targetIdx, 0, moveFileOId)
      }

      await this.directoryModel.updateOne({_id}, {$set: {fileOIdsArr: newFileOIdsArr}})

      const newDirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = newDirDB
      const directory: DirectoryType = {dirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}

      return {directory}
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
  async updateDirectoryParent(where: string, dirOId: string, newParentDirOId: string) {
    where = where + '/updateDirectoryParent'

    try {
      const _id = new Types.ObjectId(dirOId)
      await this.directoryModel.updateOne({_id}, {$set: {parentDirOId: newParentDirOId}})

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
  async updateDirectorySubDirsSequence(where: string, targetDirOId: string, moveDirOId: string, targetIdx: number) {
    where = where + '/updateDirectorySubDirsSequence'
    /**
     * parentDirOId 의 subDirOIdsArr 에서 moveDirOId 의 위치를 targetIdx 로 바꾼다.
     * - targetIdx 가 null 이면 맨 뒤로 보낸다.
     */

    try {
      const _id = new Types.ObjectId(targetDirOId)

      const dirDB = await this.directoryModel.findOne({_id})
      if (!dirDB) {
        throw {
          gkd: {targetDirOId: `존재하지 않는 디렉토리입니다.`},
          gkdErr: `존재하지 않는 디렉토리 업데이트 시도`,
          gkdStatus: {targetDirOId, moveDirOId, targetIdx},
          where
        }
      }

      const {subDirOIdsArr: prevArr} = dirDB

      const newSubDirOIdsArr = [...prevArr]
      if (targetIdx === null) {
        // 배열에서 moveDirOId 를 삭제한다.
        // 배열의 뒤에 moveDirOId 를 추가한다.
        const moveDirIdx = newSubDirOIdsArr.indexOf(moveDirOId)
        if (moveDirIdx === -1) {
          throw {
            gkd: {targetDirOId: `부모에 왜 존재하지 않을까요`},
            gkdErr: `존재하지 않는 디렉토리 업데이트 시도`,
            gkdStatus: {targetDirOId, moveDirOId, targetIdx},
            where
          }
        }
        newSubDirOIdsArr.splice(moveDirIdx, 1)
        newSubDirOIdsArr.push(moveDirOId)
      } // BLANK LINE COMMENT:
      else {
        newSubDirOIdsArr.splice(targetIdx, 0, moveDirOId)
      }

      await this.directoryModel.updateOne({_id}, {$set: {subDirOIdsArr: newSubDirOIdsArr}})

      const newDirDB = await this.directoryModel.findOne({_id})
      const {dirName, fileOIdsArr, parentDirOId, subDirOIdsArr} = newDirDB
      const directory: DirectoryType = {dirOId: targetDirOId, dirName, fileOIdsArr, parentDirOId, subDirOIdsArr}
      // BLANK LINE COMMENT:
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
