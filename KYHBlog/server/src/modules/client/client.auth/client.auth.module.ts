import {Module} from '@nestjs/common'
import {CheckJwtValidationGuard} from '@common/guards'
import {ClientAuthController} from './client.auth.controller'
import {ClientAuthService} from './client.auth.service'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'

@Module({
  imports: [
    DatabaseModule, // ::
    GKDJwtModule
  ],
  controllers: [ClientAuthController],
  providers: [CheckJwtValidationGuard, ClientAuthService],
  exports: [ClientAuthService]
})
export class ClientAuthModule {}
