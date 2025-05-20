import {Module} from '@nestjs/common'
import {AdminCommunityController} from './admin.community.controller'
import {AdminCommunityService} from './admin.community.service'
import {DatabaseModule} from 'src/modules/database/database.module'
import {GKDJwtModule} from 'src/modules/gkdJwt/gkdJwt.module'
import {CheckAdminGuard} from 'src/common/guards/guards.checkAdmin'
import {LoggerModule} from 'src/modules/logger/logger.module'

@Module({
  imports: [DatabaseModule, GKDJwtModule, LoggerModule],
  controllers: [AdminCommunityController],
  providers: [AdminCommunityService, CheckAdminGuard],
  exports: [AdminCommunityService]
})
export class AdminCommunityModule {}
