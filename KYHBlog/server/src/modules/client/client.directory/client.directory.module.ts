import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@common/guards'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'

import {ClientDirectoryController} from './client.directory.controller'
import {ClientDirectoryService} from './client.directory.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientDirectoryController],
  providers: [CheckAdminGuard, ClientDirectoryService],
  exports: [ClientDirectoryService]
})
export class ClientDirectoryModule {}
