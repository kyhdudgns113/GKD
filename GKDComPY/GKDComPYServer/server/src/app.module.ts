import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {mongodbUrl} from './common/secret'
import * as M from './modules'

@Module({
  imports: [
    M.AdminModule, // BLANK LINE COMMENT:
    M.ClientModule,
    M.DatabaseModule,
    M.GKDJwtModule,
    M.GKDLockModule,
    M.PokerModule,
    M.SocketModule,
    MongooseModule.forRoot(mongodbUrl)
  ]
})
export class AppModule {}
