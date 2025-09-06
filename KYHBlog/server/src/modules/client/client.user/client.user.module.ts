import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@common/guards'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'

import {ClientUserController} from './client.user.controller'
import {ClientUserService} from './client.user.service'
import {SocketModule} from '@module/socket'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientUserController],
  providers: [CheckAdminGuard, ClientUserService],
  exports: [ClientUserService]
})
export class ClientUserModule {}
