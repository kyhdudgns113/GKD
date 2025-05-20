import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {
  DailyRecord,
  DailyRecordSchema,
  RecordBlock,
  RecordBlockSchema
} from './dailyRecordDB.entity'
import {DailyRecordDBService} from './dailyRecordDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: DailyRecord.name, schema: DailyRecordSchema}]),
    MongooseModule.forFeature([{name: RecordBlock.name, schema: RecordBlockSchema}])
  ],
  providers: [DailyRecordDBService],
  exports: [DailyRecordDBService]
})
export class DailyRecordDBModule {}
