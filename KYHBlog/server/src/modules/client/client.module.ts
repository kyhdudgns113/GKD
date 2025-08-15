import {Module} from '@nestjs/common'
import {ClientAuthModule} from './client.auth'

@Module({
  imports: [ClientAuthModule],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
