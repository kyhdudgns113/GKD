import {Module} from '@nestjs/common'
import {CheckJwtValidationGuard} from 'src/common/guards'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {ClientDocController} from './client.doc.controller'
import {ClientDocService} from './client.doc.service'
import {LoggerModule} from 'src/modules/logger/logger.module'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [ClientDocController],
  providers: [ClientDocService, CheckJwtValidationGuard],
  exports: [ClientDocService]
})
export class ClientDocModule {}
