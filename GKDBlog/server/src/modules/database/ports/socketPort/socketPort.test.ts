import {DatabaseHubServiceTest} from '../../databaseHub'
import {SocketPortService} from './socketPort.service'

export class SocketPortServiceTest {
  private readonly dbHubService = new DatabaseHubServiceTest().dbHubService
  public socketPortService = new SocketPortService(this.dbHubService)
}
