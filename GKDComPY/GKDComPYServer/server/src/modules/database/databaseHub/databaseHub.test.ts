import {
  ChatDBServiceTest,
  ClubDBServiceTest,
  CommunityDBServiceTest,
  DailyRecordDBServiceTest,
  EMemberDBServiceTest,
  GameSettingDBTest,
  GDocumentDBServiceTest,
  GKDLogDBServiceTest,
  MemberDBServiceTest,
  PokerUserDBTest,
  UserDBServiceTest,
  WeeklyRecordDBServiceTest
} from '../_schemas'
import {DatabaseHubService} from './databaseHub.service'

export class DatabaseHubServiceTest {
  private readonly chatDBService = new ChatDBServiceTest().chatDBService
  private readonly clubDBService = new ClubDBServiceTest().clubDBService
  private readonly commDBService = new CommunityDBServiceTest().communityDBService
  private readonly dailyDBService = new DailyRecordDBServiceTest().dailyRecordDBService
  private readonly docDBService = new GDocumentDBServiceTest().docDBService
  private readonly eMemberDBService = new EMemberDBServiceTest().eMemberDBService
  private readonly logDBService = new GKDLogDBServiceTest().logDBService
  private readonly memberDBService = new MemberDBServiceTest().memberDBService
  private readonly pokerSettingDBService = new GameSettingDBTest().gameSettingDBService
  private readonly pokerUserDBService = new PokerUserDBTest().pokerUserDBService
  private readonly userDBService = new UserDBServiceTest().userDBService
  private readonly weeklyDBService = new WeeklyRecordDBServiceTest().weeklyRecordDBService

  public dbHubService = new DatabaseHubService(
    this.chatDBService,
    this.clubDBService,
    this.commDBService,
    this.dailyDBService,
    this.docDBService,
    this.eMemberDBService,
    this.logDBService,
    this.memberDBService,
    this.pokerSettingDBService,
    this.pokerUserDBService,
    this.userDBService,
    this.weeklyDBService
  )
}
