import {Module} from '@nestjs/common'
import {AdminController} from './admin.controller'
import {AdminService} from './admin.service'

import {AdminUserListModule} from './admin.userList/admin.userList.module'
import {AdminCommunityModule} from './admin.community/admin.community.module'
import {DatabaseModule} from '../database/database.module'
import {GKDJwtModule} from '../gkdJwt/gkdJwt.module'

import {CheckAdminGuard} from 'src/common/guards/guards.checkAdmin'
import {LoggerModule} from '../logger/logger.module'
import {AdminLogListModule} from './admin.logList/admin.logList.module'

@Module({
  imports: [
    AdminCommunityModule, // BLANK LINE COMMENT:
    AdminLogListModule,
    AdminUserListModule,
    DatabaseModule,
    GKDJwtModule,
    LoggerModule
  ],
  controllers: [AdminController],
  providers: [AdminService, CheckAdminGuard],
  exports: [AdminService]
})
export class AdminModule {}
