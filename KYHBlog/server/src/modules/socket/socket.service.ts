import {Injectable} from '@nestjs/common'
import {SocketGateway} from './socket.gateway'
import {SocketInfoService, SocketUserService} from './services'

import * as HTTP from '@httpDataTypes'
import * as T from '@common/types'

/**
 * SocketService
 *   - 다른 모듈에서 소켓을 사용할때 쓴다.
 */
@Injectable()
export class SocketService {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly infoService: SocketInfoService,
    private readonly userService: SocketUserService
  ) {}

  async sendUserAlarm(alarm: T.AlarmType) {
    try {
      this.gateway.sendUserAlarm(alarm)
      // ::
    } catch (errObj) {
      // ::
    }
  }
}
