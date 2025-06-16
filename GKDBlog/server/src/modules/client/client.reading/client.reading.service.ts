import {ClientPortService} from '@modules/database'
import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {LoggerService} from 'src/modules/logger'

@Injectable()
export class ClientReadingService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly portService: ClientPortService
  ) {}

  async readFile(fileOid: string) {
    const where = '/client/reading/readFile'
    try {
      const {file} = await this.portService.readFile(fileOid)
      // ::
      return {ok: true, body: {file}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }
}
