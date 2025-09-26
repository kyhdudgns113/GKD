import {DBHubService} from '../../dbHub'
import {Injectable} from '@nestjs/common'
import {GKDLockService} from '@module/gkdLock'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'

@Injectable()
export class WorkerPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  async cleaningLog(deleteDateBefore: Date) {
    const where = `/worker/cleaningLog`

    try {
      await this.dbHubService.deleteLogDateBefore(where, deleteDateBefore)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
