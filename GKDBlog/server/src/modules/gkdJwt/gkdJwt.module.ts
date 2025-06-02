import {Module} from '@nestjs/common'
import {GKDJwtService} from './gkdJwt.service'
import {JwtModule} from '@nestjs/jwt'
import {GKDJwtController} from './gkdJwt.controller'
import {gkdJwtSecret, gkdJwtSignOption} from '../../../src/common/secret'

@Module({
  imports: [
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  controllers: [GKDJwtController],
  providers: [GKDJwtService],
  exports: [GKDJwtService]
})
export class GKDJwtModule {}
