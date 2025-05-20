import {Module} from '@nestjs/common'
import {PokerService} from './poker.service'
import {PokerController} from './poker.controller'
import {DatabaseModule} from '../database'

@Module({
  imports: [DatabaseModule],
  controllers: [PokerController],
  providers: [PokerService],
  exports: [PokerService]
})
export class PokerModule {}
