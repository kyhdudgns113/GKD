import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {AdminUserListController} from './admin.userList.controller'
import {AdminUserListService} from './admin.userList.service'
import {CheckAdminGuard} from 'src/common/guards/guards.checkAdmin'
import {LoggerModule} from 'src/modules/logger/logger.module'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [AdminUserListController],
  providers: [AdminUserListService, CheckAdminGuard],
  exports: []
})
export class AdminUserListModule {}
