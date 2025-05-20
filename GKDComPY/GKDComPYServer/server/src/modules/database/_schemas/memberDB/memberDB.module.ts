import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {Card, CardSchema, Member, MemberSchema} from './memberDB.entity'
import {MemberDBService} from './memberDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: Member.name, schema: MemberSchema}]),
    MongooseModule.forFeature([{name: Card.name, schema: CardSchema}])
  ],
  providers: [MemberDBService],
  exports: [MemberDBService]
})
export class MemberDBModule {}
