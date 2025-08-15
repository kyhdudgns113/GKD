import {Module} from '@nestjs/common'
import {ClientAuthPortModule, ClientAuthPortService} from './clientAuthPort'
import {DBHubModule} from '../../dbHub'

@Module({
  imports: [ClientAuthPortModule, DBHubModule],
  controllers: [],
  providers: [ClientAuthPortService],
  exports: [ClientAuthPortService]
})
export class ClientPortModule {}
