import {Module} from '@nestjs/common'
import {DBHubModule} from './dbHub'

import * as P from './ports'

@Module({
  imports: [
    DBHubModule, // ::
    P.ClientPortModule,
    P.JwtPortModule
  ],
  controllers: [],
  providers: [P.ClientAuthPortService, P.ClientDirPortService, P.JwtPortService],
  exports: [P.ClientAuthPortService, P.ClientDirPortService, P.JwtPortService]
})
export class DatabaseModule {}
