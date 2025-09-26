import {Module} from '@nestjs/common'
import {GKDLogService} from './gkdLog.service'
import {DatabaseModule} from '@module/database'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [GKDLogService],
  exports: [GKDLogService]
})
export class GKDLogModule {}
