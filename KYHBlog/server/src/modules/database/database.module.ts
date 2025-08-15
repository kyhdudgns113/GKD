import {Module} from '@nestjs/common'
import {DBHubModule} from './dbHub'

import * as P from './ports'

@Module({
  imports: [DBHubModule, P.ClientPortModule],
  controllers: [],
  providers: [P.ClientAuthPortService],
  exports: [P.ClientAuthPortService]
})
export class DatabaseModule {}
