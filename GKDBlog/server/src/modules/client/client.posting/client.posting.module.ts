import {Module} from '@nestjs/common'
import {ClientPostingController} from './client.posting.controller'
import {ClientPostingService} from './client.posting.service'
import {DatabaseModule} from 'src/modules/database'
import {LoggerModule} from 'src/modules/logger'
import {CheckJwtValidationGuard} from 'src/common/guards/guards.checkJwtValidation'
import {GKDJwtModule} from 'src/modules/gkdJwt'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [ClientPostingController],
  providers: [CheckJwtValidationGuard, ClientPostingService],
  exports: [ClientPostingService]
})
export class ClientPostingModule {}
