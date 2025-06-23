import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub/databaseHub.module'
import {SocketPortService} from './socketPort.service'

@Module({
  imports: [DatabaseHubModule],
  controllers: [],
  providers: [SocketPortService],
  exports: [SocketPortService]
})
export class SocketPortModule {}
