import {Module} from '@nestjs/common'

import {ClientAuthModule} from './client.auth/client.auth.module'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {LoggerModule} from '@modules/logger'
import {ClientPostingModule} from './client.posting/client.posting.module'
import {ClientReadingModule} from './client.reading/client.reading.module'

@Module({
  imports: [
    ClientAuthModule, // ::
    ClientPostingModule,
    ClientReadingModule,
    DatabaseModule,
    GKDJwtModule, //
    LoggerModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
