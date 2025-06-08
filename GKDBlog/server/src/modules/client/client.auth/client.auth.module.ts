import {Module} from '@nestjs/common'
import {PassportModule} from '@nestjs/passport'
import {ClientAuthController} from './client.auth.controller'
import {ClientAuthService} from './client.auth.service'
import {LoggerModule} from '@modules/logger'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {GoogleStrategy} from '@common/google/google.strategy'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

@Module({
  imports: [
    DatabaseModule, // BLANK LINE COMMENT:
    GKDJwtModule,
    LoggerModule,
    PassportModule
  ],
  controllers: [ClientAuthController],
  providers: [CheckJwtValidationGuard, ClientAuthService, GoogleStrategy],
  exports: [ClientAuthService]
})
export class ClientAuthModule {}
