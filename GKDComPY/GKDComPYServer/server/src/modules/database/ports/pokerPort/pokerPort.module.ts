import {Module} from '@nestjs/common'
import {PokerPortService} from './pokerPort.service'
import {DatabaseHubModule} from '../../databaseHub'

@Module({
  imports: [DatabaseHubModule],
  providers: [PokerPortService],
  exports: [PokerPortService]
})
export class PokerPortModule {}
