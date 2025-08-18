import {Module} from '@nestjs/common'
import {ClientAuthModule} from './client.auth'
import {ClientDirectoryModule} from './client.directory'

@Module({
  imports: [
    ClientAuthModule, // ::
    ClientDirectoryModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
