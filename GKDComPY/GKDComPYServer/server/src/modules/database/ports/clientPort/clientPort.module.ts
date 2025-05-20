import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub/databaseHub.module'
import {ClientPortService} from './clientPort.service'
import {GKDLockModule} from 'src/modules/gkdLock/gkdLock.module'

@Module({
  imports: [DatabaseHubModule, GKDLockModule],
  controllers: [],
  providers: [ClientPortService],
  exports: [ClientPortService]
})
export class ClientPortModule {}
