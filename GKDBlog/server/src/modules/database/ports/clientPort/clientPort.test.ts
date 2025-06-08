import {DatabaseHubServiceTest} from '../../databaseHub/databaseHub.test'
import {ClientPortService} from './clientPort.service'

export class ClientPortServiceTest {
  private readonly dbHubServiceTest = new DatabaseHubServiceTest()

  public clientPortService = new ClientPortService(this.dbHubServiceTest.dbHubService)
}
