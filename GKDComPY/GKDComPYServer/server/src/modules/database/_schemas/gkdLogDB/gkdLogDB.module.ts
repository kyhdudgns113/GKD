import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {GKDLog, GKDLogSchema} from './gkdLogDB.entity'
import {GKDLogDBService} from './gkdLogDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: GKDLog.name, schema: GKDLogSchema}])],
  providers: [GKDLogDBService],
  exports: [GKDLogDBService]
})
export class GKDLogDBModule {}
