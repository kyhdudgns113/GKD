import {Module} from '@nestjs/common'
import {ClientAuthController} from './client.auth.controller'
import {ClientAuthService} from './client.auth.service'
import {LoggerModule} from '../../../modules/logger'
import {DatabaseModule} from 'src/modules/database'
import {GKDJwtModule} from 'src/modules/gkdJwt'
import {PassportModule} from '@nestjs/passport'
import {GoogleStrategy} from 'src/common/google/google.strategy'
import {CheckJwtValidationGuard} from 'src/common/guards/guards.checkJwtValidation'

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
