import {Module} from '@nestjs/common'

import {ClientAuthModule} from './client.auth/client.auth.module'
import {ClientDefaultModule} from './client.default/client.default.module'
import {ClientPostingModule} from './client.posting/client.posting.module'
import {ClientReadingModule} from './client.reading/client.reading.module'
import {ClientUserInfoModule} from './client.userInfo/client.userInfo.module'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {LoggerModule} from '@modules/logger'
import {SocketModule} from '@modules/socket'

@Module({
  imports: [
    ClientAuthModule, // ::
    ClientDefaultModule,
    ClientPostingModule,
    ClientReadingModule,
    ClientUserInfoModule,
    DatabaseModule,
    GKDJwtModule,
    LoggerModule,
    SocketModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
