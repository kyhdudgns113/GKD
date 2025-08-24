import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@common/guards'
import {DatabaseModule} from '@module/database'
import {GKDJwtModule} from '@module/gkdJwt'

import {ClientFileController} from './client.file.controller'
import {ClientFileService} from './client.file.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientFileController],
  providers: [CheckAdminGuard, ClientFileService],
  exports: [ClientFileService]
})
export class ClientFileModule {}
