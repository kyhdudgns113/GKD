import {Module} from '@nestjs/common'
import {WorkerService} from './worker.service'
import {ScheduleModule} from '@nestjs/schedule'
import {DatabaseModule} from '@module/database'

@Module({
  imports: [
    ScheduleModule.forRoot(), // ::

    DatabaseModule
  ],
  controllers: [],
  providers: [WorkerService],
  exports: [WorkerService]
})
export class WorkerModule {}
