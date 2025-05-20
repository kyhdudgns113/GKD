import {Module} from '@nestjs/common'
import {AdminPortService} from './adminPort.service'
import {DatabaseHubModule} from '../../databaseHub/databaseHub.module'

@Module({
  imports: [DatabaseHubModule],
  controllers: [],
  providers: [AdminPortService],
  exports: [AdminPortService]
})
export class AdminPortModule {}
