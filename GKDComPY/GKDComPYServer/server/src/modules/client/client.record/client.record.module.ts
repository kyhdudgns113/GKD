import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {LoggerModule} from 'src/modules/logger/logger.module'
import {ClientRecordController} from './client.record.controller'
import {ClientRecordService} from './client.record.service'

@Module({
  imports: [
    DatabaseModule, // BLANK LINE COMMENT:
    GKDJwtModule,
    LoggerModule
  ],
  controllers: [ClientRecordController],
  providers: [ClientRecordService],
  exports: [ClientRecordService]
})
export class ClientRecordModule {}
