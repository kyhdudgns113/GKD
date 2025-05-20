import {DatabaseHubServiceTest} from '../../databaseHub/databaseHub.test'
import {LoggerPortService} from './loggerPort.service'

export class LoggerPortServiceTest {
  private readonly dbHubService = new DatabaseHubServiceTest().dbHubService
  public loggerPortService = new LoggerPortService(this.dbHubService)
}
