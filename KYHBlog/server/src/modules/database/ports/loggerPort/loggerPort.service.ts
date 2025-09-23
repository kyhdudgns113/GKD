import {DBHubService} from '../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dtos'
import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'
import * as U from '@utils'
import * as V from '@values'

@Injectable()
export class LoggerPortService {
  constructor(private readonly dbHubService: DBHubService) {}
}
