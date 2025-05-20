import {Module} from '@nestjs/common'
import {DatabaseHubModule} from '../../databaseHub/databaseHub.module'
import {JwtPortService} from './jwtPort.service'

@Module({
  imports: [DatabaseHubModule],
  controllers: [],
  providers: [JwtPortService],
  exports: [JwtPortService]
})
export class JwtPortModule {}
