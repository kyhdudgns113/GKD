import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {
  RecordColInfo,
  RecordColInfoSchema,
  RecordDateInfo,
  RecordDateInfoSchema,
  RecordMemberInfo,
  RecordMemberInfoSchema,
  RecordRowInfo,
  RecordRowInfoSchema,
  WeeklyRecord,
  WeeklyRecordSchema
} from './weeklyRecordDB.entity'
import {WeeklyRecordDBService} from './weeklyRecordDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: WeeklyRecord.name, schema: WeeklyRecordSchema}]),
    MongooseModule.forFeature([{name: RecordRowInfo.name, schema: RecordRowInfoSchema}]),
    MongooseModule.forFeature([{name: RecordColInfo.name, schema: RecordColInfoSchema}]),
    MongooseModule.forFeature([{name: RecordMemberInfo.name, schema: RecordMemberInfoSchema}]),
    MongooseModule.forFeature([{name: RecordDateInfo.name, schema: RecordDateInfoSchema}])
  ],
  providers: [WeeklyRecordDBService],
  exports: [WeeklyRecordDBService]
})
export class WeeklyRecordDBModule {}
