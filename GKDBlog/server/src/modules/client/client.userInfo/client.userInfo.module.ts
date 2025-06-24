import {Module} from '@nestjs/common'
import {ClientUserInfoController} from './client.userInfo.controller'
import {ClientUserInfoService} from './client.userInfo.service'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {LoggerModule} from '@modules/logger'
import {SocketModule} from '@modules/socket'
import {CheckJwtValidationGuard} from '@common/guards/guards.checkJwtValidation'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule, SocketModule],
  controllers: [ClientUserInfoController],
  providers: [CheckJwtValidationGuard, ClientUserInfoService],
  exports: [ClientUserInfoService]
})
export class ClientUserInfoModule {}
