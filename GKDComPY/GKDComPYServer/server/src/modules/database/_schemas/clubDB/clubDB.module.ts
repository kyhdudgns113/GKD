import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {Club, ClubSchema, WeekRow, WeekRowSchema} from './clubDB.entity'
import {ClubDBService} from './clubDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: Club.name, schema: ClubSchema}]),
    MongooseModule.forFeature([{name: WeekRow.name, schema: WeekRowSchema}])
  ],
  providers: [ClubDBService],
  exports: [ClubDBService]
})
export class ClubDBModule {}
