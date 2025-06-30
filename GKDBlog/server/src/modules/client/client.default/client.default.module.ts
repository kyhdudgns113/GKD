import {Module} from '@nestjs/common'
import {ClientDefaultController} from './client.default.controller'
import {ClientDefaultService} from './client.default.service'
import {DatabaseModule} from '@modules/database'
import {LoggerModule} from '@modules/logger'

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [ClientDefaultController],
  providers: [ClientDefaultService],
  exports: [ClientDefaultService]
})
export class ClientDefaultModule {}
