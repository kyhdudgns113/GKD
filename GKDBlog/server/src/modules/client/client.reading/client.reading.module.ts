import {Module} from '@nestjs/common'
import {ClientReadingController} from './client.reading.controller'
import {ClientReadingService} from './client.reading.service'
import {DatabaseModule} from '@modules/database'
import {LoggerModule} from '@modules/logger'
import {GKDJwtModule} from '@modules/gkdJwt'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [ClientReadingController],
  providers: [CheckJwtValidationGuard, ClientReadingService],
  exports: [ClientReadingService]
})
export class ClientReadingModule {}
