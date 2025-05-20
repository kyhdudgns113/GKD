import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {EMember, EMemberArr, EMemberArrSchema, EMemberSchema} from './eMemberDB.entity'
import {EMemberDBService} from './eMemberDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: EMemberArr.name, schema: EMemberArrSchema}]),
    MongooseModule.forFeature([{name: EMember.name, schema: EMemberSchema}])
  ],
  providers: [EMemberDBService],
  exports: [EMemberDBService]
})
export class EMemberDBModule {}
