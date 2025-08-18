import {Module} from '@nestjs/common'
import {ClientAuthPortModule, ClientAuthPortService} from './clientAuthPort'
import {ClientDirPortModule, ClientDirPortService} from './clientDirPort'
import {DBHubModule} from '../../dbHub'

@Module({
  imports: [ClientAuthPortModule, ClientDirPortModule, DBHubModule],
  controllers: [],
  providers: [ClientAuthPortService, ClientDirPortService],
  exports: [ClientAuthPortService, ClientDirPortService]
})
export class ClientPortModule {}
