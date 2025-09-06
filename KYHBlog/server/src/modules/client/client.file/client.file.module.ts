import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@common/guards'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'
import {SocketModule, SocketService} from '@module/socket'

import {ClientFileController} from './client.file.controller'
import {ClientFileService} from './client.file.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientFileController],
  providers: [CheckAdminGuard, ClientFileService, SocketService],
  exports: [ClientFileService]
})
export class ClientFileModule {}
