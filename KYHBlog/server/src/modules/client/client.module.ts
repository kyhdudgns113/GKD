import {Module} from '@nestjs/common'
import {ClientAuthModule} from './client.auth'
import {ClientDirectoryModule} from './client.directory'
import {ClientFileModule} from './client.file'
import {ClientUserModule} from './client.user'

@Module({
  imports: [
    ClientAuthModule, // ::
    ClientDirectoryModule,
    ClientFileModule,
    ClientUserModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
