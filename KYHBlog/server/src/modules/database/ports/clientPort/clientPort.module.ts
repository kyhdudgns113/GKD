import {Module} from '@nestjs/common'
import {ClientAuthPortModule, ClientAuthPortService} from './clientAuthPort'
import {ClientDirPortModule, ClientDirPortService} from './clientDirPort'
import {ClientFilePortModule, ClientFilePortService} from './clientFilePort'
import {DBHubModule} from '../../dbHub'

@Module({
  imports: [ClientAuthPortModule, ClientDirPortModule, ClientFilePortModule, DBHubModule],
  controllers: [],
  providers: [ClientAuthPortService, ClientDirPortService, ClientFilePortService],
  exports: [ClientAuthPortService, ClientDirPortService, ClientFilePortService]
})
export class ClientPortModule {}
