import {Module} from '@nestjs/common'
import {GkdLogService} from './gkdLog.service'
import {DatabaseModule} from '@module/database'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [GkdLogService],
  exports: [GkdLogService]
})
export class GkdLogModule {}
