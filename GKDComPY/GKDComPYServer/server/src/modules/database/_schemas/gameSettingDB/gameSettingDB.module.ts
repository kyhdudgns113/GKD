import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {GameSettingDB, GameSettingDBSchema} from './gameSettingDB.entity'
import {GameSettingDBService} from './gameSettingDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: GameSettingDB.name, schema: GameSettingDBSchema}])],
  providers: [GameSettingDBService],
  exports: [GameSettingDBService]
})
export class GameSettingDBModule {}
