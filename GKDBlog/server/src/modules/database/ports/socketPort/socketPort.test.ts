import {GKDLockService} from '@modules/gkdLock'
import {DatabaseHubServiceTest} from '../../databaseHub'
import {SocketPortService} from './socketPort.service'

export class SocketPortServiceTest {
  private readonly dbHubService = new DatabaseHubServiceTest().dbHubService
  private readonly lockService = new GKDLockService()

  public socketPortService = new SocketPortService(this.dbHubService, this.lockService)
}
