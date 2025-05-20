import {model} from 'mongoose'
import {GameSettingDB, GameSettingDBSchema} from './gameSettingDB.entity'
import {GameSettingDBService} from './gameSettingDB.service'

export class GameSettingDBTest {
  private gameSettingModel = model(GameSettingDB.name, GameSettingDBSchema)

  public gameSettingDBService = new GameSettingDBService(this.gameSettingModel)
}
