import {Module} from '@nestjs/common'

import {ClientAuthModule} from './client.auth/client.auth.module'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {LoggerModule} from '@modules/logger'
import {ClientPostingModule} from './client.posting/client.posting.module'

@Module({
  imports: [
    ClientAuthModule, // BLANK LINE COMMENT:
    ClientPostingModule,
    DatabaseModule,
    GKDJwtModule, //
    LoggerModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
