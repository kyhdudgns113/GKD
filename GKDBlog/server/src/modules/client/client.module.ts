import {Module} from '@nestjs/common'
import {ClientAuthModule} from './client.auth/client.auth.module'
import {DatabaseModule} from '../database'
import {GKDJwtModule} from '../gkdJwt'
import {LoggerModule} from '../logger'

@Module({
  imports: [ClientAuthModule, DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
