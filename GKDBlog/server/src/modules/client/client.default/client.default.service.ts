import {ClientPortService} from '@modules/database'
import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {LoggerService} from 'src/modules/logger'

@Injectable()
export class ClientDefaultService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async readIntroFile() {
    const where = '/client/default/readIntroFile'
    try {
      const {file} = await this.portService.readIntroFile()
      return {ok: true, body: {file}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }
}
