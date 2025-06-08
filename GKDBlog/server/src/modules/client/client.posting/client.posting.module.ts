import {Module} from '@nestjs/common'
import {ClientPostingController} from './client.posting.controller'
import {ClientPostingService} from './client.posting.service'

import {DatabaseModule} from '@modules/database'
import {LoggerModule} from '@modules/logger'
import {GKDJwtModule} from '@modules/gkdJwt'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [ClientPostingController],
  providers: [CheckJwtValidationGuard, ClientPostingService],
  exports: [ClientPostingService]
})
export class ClientPostingModule {}
