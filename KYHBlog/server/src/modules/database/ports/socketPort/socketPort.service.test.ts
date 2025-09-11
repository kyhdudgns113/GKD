import {DBHubServiceTest} from '../../dbHub'
import {SocketPortService} from './socketPort.service'
import {GKDLockTest} from '@module/gkdLock'

export class SocketPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService
  private static gkdLockService = GKDLockTest.lockService

  public static socketPortService = new SocketPortService(SocketPortServiceTest.dbHubService, SocketPortServiceTest.gkdLockService)
}
