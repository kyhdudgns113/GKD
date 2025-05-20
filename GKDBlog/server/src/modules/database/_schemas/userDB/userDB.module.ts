import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {User, UserSchema} from './userDB.entity'
import {UserDBService} from './userDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [UserDBService],
  exports: [UserDBService]
})
export class UserDBModule {}
