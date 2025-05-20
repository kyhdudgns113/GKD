import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub/databaseHub.module'
import {LoggerPortService} from './loggerPort.service'

@Module({
  imports: [DatabaseHubModule],
  controllers: [],
  providers: [LoggerPortService],
  exports: [LoggerPortService]
})
export class LoggerPortModule {}
