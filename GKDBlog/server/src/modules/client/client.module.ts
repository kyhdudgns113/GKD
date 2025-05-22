import {Module} from '@nestjs/common'
import {ClientAuthModule} from './client.auth/client.auth.module'
import {DatabaseModule} from '../database'
import {GKDJwtModule} from '../gkdJwt'
import {LoggerModule} from '../logger'
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
