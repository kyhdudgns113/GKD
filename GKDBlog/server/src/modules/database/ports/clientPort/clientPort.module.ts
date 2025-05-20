import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub'
import {ClientPortService} from './clientPort.service'

@Module({
  imports: [DatabaseHubModule],
  controllers: [],
  providers: [ClientPortService],
  exports: [ClientPortService]
})
export class ClientPortModule {}
