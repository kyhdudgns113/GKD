import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@common/guards'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'

import {ClientAdminController} from './client.admin.controller'
import {ClientAdminService} from './client.admin.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientAdminController],
  providers: [CheckAdminGuard, ClientAdminService],
  exports: [ClientAdminService]
})
export class ClientAdminModule {}
