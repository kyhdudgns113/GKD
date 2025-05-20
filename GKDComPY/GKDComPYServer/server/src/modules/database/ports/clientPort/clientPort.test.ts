import {DatabaseHubServiceTest} from '../../databaseHub/databaseHub.test'
import {ClientPortService} from './clientPort.service'
import {GKDLockTest} from '../../../gkdLock/gkdLock.test'

export class ClientPortServiceTest {
  private readonly dbHubService = new DatabaseHubServiceTest().dbHubService
  private readonly lockService = new GKDLockTest().lockService
  public clientPortService = new ClientPortService(this.dbHubService, this.lockService)
}
