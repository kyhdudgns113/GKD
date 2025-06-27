import {Module} from '@nestjs/common'
import {DatabaseHubService} from './databaseHub.service'
import * as M from '../_schemas'

@Module({
  imports: [
    M.AlarmDBModule,
    M.ChatDBModule,
    M.DirectoryDBModule,
    M.FileDBModule,
    M.GKDLogDBModule, // ::
    M.UserDBModule
  ],
  controllers: [],
  providers: [DatabaseHubService],
  exports: [DatabaseHubService]
})
export class DatabaseHubModule {}
