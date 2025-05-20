import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {PokerUser, PokerUserSchema} from './pokerUserDB.entity'
import {PokerUserDBService} from './pokerUserDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: PokerUser.name, schema: PokerUserSchema}])],
  providers: [PokerUserDBService],
  exports: [PokerUserDBService]
})
export class PokerUserDBModule {}
