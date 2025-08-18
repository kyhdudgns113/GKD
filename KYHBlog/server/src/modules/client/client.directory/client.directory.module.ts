import {Module} from '@nestjs/common'
import {ClientDirectoryController} from './client.directory.controller'
import {ClientDirectoryService} from './client.directory.service'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientDirectoryController],
  providers: [ClientDirectoryService],
  exports: [ClientDirectoryService]
})
export class ClientDirectoryModule {}
