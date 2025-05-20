import {LoggerPortServiceTest} from '../database/ports/loggerPort/loggerPort.test'
import {LoggerService} from './logger.service'

export class LoggerTest {
  private portService = new LoggerPortServiceTest().loggerPortService
  public lockService = new LoggerService(this.portService)
}
