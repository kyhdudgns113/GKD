import {Module} from '@nestjs/common'
import {LoggerService} from './logger.service'
import {DatabaseModule} from '../database'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
