import {Module} from '@nestjs/common'
import {AppController} from './app.controller'

import * as M from './modules'

@Module({
  imports: [
    M.ClientModule, // ::
    M.DatabaseModule,
    M.GKDJwtModule,
    M.GKDLockModule,
    M.SocketModule
  ],
  controllers: [AppController]
})
export class AppModule {}
