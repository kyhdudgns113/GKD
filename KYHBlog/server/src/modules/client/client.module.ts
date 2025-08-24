import {Module} from '@nestjs/common'
import {ClientAuthModule} from './client.auth'
import {ClientDirectoryModule} from './client.directory'
import {ClientFileModule} from './client.file'

@Module({
  imports: [
    ClientAuthModule, // ::
    ClientDirectoryModule,
    ClientFileModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
