import {Module} from '@nestjs/common'
import {DatabaseHubService} from './databaseHub.service'
import {
  ChatDBModule,
  ClubDBModule,
  CommunityDBModule,
  DailyRecordDBModule,
  EMemberDBModule,
  GameSettingDBModule,
  GDocumentModule,
  GKDLogDBModule,
  MemberDBModule,
  PokerUserDBModule,
  UserDBModule,
  WeeklyRecordDBModule
} from '../_schemas'

@Module({
  imports: [
    ChatDBModule,
    ClubDBModule,
    CommunityDBModule,
    DailyRecordDBModule,
    EMemberDBModule,
    GameSettingDBModule,
    GDocumentModule,
    GKDLogDBModule,
    MemberDBModule,
    PokerUserDBModule,
    UserDBModule,
    WeeklyRecordDBModule
  ],
  controllers: [],
  providers: [DatabaseHubService],
  exports: [DatabaseHubService]
})
export class DatabaseHubModule {}
