import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {Community, CommunitySchema} from './communityDB.entity'
import {CommunityDBService} from './communityDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: Community.name, schema: CommunitySchema}])],
  providers: [CommunityDBService],
  exports: [CommunityDBService]
})
export class CommunityDBModule {}
