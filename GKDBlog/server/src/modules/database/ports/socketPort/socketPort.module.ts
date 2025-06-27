import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub/databaseHub.module'
import {SocketPortService} from './socketPort.service'
import {GKDLockModule} from '@modules/gkdLock'

@Module({
  imports: [DatabaseHubModule, GKDLockModule],
  controllers: [],
  providers: [SocketPortService],
  exports: [SocketPortService]
})
export class SocketPortModule {}
