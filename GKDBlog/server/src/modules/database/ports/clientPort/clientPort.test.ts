import {DatabaseHubServiceTest} from '../../databaseHub/databaseHub.test'
import {ClientPortService} from './clientPort.service'
import {GKDLockService} from '@modules/gkdLock'

export class ClientPortServiceTest {
  private readonly dbHubServiceTest = new DatabaseHubServiceTest()
  private readonly gkdLockService = new GKDLockService()

  public clientPortService = new ClientPortService(this.dbHubServiceTest.dbHubService, this.gkdLockService)
}
