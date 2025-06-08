import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {UserDB, UserDBSchema} from './userDB.entity'
import {UserDBService} from './userDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: UserDB.name, schema: UserDBSchema}])],
  providers: [UserDBService],
  exports: [UserDBService]
})
export class UserDBModule {}
