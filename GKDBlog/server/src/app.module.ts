import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {mongodbUrl} from './common/secret'

import * as M from './modules'

@Module({
  imports: [
    M.ClientModule, // ::
    M.DatabaseModule,
    M.GKDJwtModule,
    M.GKDLockModule,
    M.LoggerModule,
    MongooseModule.forRoot(mongodbUrl)
  ]
})
export class AppModule {}
