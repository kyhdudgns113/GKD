import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub'
import {ClientPortService} from './clientPort.service'
import {GKDLockModule} from '@modules/gkdLock'

@Module({
  imports: [DatabaseHubModule, GKDLockModule],
  controllers: [],
  providers: [ClientPortService],
  exports: [ClientPortService]
})
export class ClientPortModule {}
