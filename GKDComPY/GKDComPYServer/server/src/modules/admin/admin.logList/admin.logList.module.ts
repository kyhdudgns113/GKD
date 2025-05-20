import {Module} from '@nestjs/common'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {CheckAdminGuard} from 'src/common/guards/guards.checkAdmin'
import {LoggerModule} from 'src/modules/logger/logger.module'
import {AdminLogListController} from './admin.logList.controller'
import {AdminLogListService} from './admin.logList.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [AdminLogListController],
  providers: [AdminLogListService, CheckAdminGuard],
  exports: [AdminLogListService]
})
export class AdminLogListModule {}
