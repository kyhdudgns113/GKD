import {Module} from '@nestjs/common'
import {AppController} from './app.controller'

import * as M from './modules'

@Module({
  imports: [
    M.ClientModule, // ::
    M.DatabaseModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
