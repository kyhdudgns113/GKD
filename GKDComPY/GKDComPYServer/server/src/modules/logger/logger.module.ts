import {Module} from '@nestjs/common'

import {DatabaseModule} from '../database/database.module'
import {LoggerService} from './logger.service'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
