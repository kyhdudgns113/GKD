import {Module} from '@nestjs/common'
import {ClientAuthPortModule, ClientAuthPortService} from './clientAuthPort'
import {ClientDirPortModule, ClientDirPortService} from './clientDirPort'
import {ClientFilePortModule, ClientFilePortService} from './clientFilePort'
import {ClientUserPortModule, ClientUserPortService} from './clientUserPort'
import {DBHubModule} from '../../dbHub'

@Module({
  imports: [
    ClientAuthPortModule, // ::
    ClientDirPortModule,
    ClientFilePortModule,
    ClientUserPortModule,
    DBHubModule
  ],
  controllers: [],
  providers: [
    ClientAuthPortService, // ::
    ClientDirPortService,
    ClientFilePortService,
    ClientUserPortService
  ],
  exports: [
    ClientAuthPortService, // ::
    ClientDirPortService,
    ClientFilePortService,
    ClientUserPortService
  ]
})
export class ClientPortModule {}
