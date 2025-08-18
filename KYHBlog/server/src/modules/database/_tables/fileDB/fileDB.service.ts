import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {FileRowType} from '@common/types'

@Injectable()
export class FileDBService {
  constructor(private readonly dbService: DBService) {}

  async readFileRowArrByDirOId(where: string, dirOId: string) {
    try {
      const query = `SELECT * FROM files WHERE dirOId = ?`
      const [result] = await this.dbService.getConnection().execute(query, [dirOId])

      const resultArr = result as RowDataPacket[]

      resultArr.sort((a, b) => a.fileIdx - b.fileIdx)

      const fileRowArr: FileRowType[] = resultArr.map(row => {
        const {fileOId, fileName, dirOId, fileStatus} = row

        const fileRow: FileRowType = {fileOId, fileName, dirOId, fileStatus}

        return fileRow
      })

      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
