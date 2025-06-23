import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {AlarmDB, AlarmDBSchema} from './alarmDB.entity'
import {AlarmDBService} from './alarmDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: AlarmDB.name, schema: AlarmDBSchema}])],
  providers: [AlarmDBService],
  exports: [AlarmDBService]
})
export class AlarmDBModule {}
