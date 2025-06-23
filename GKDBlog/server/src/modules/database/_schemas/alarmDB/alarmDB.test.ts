import {model} from 'mongoose'
import {AlarmDB, AlarmDBSchema} from './alarmDB.entity'
import {AlarmDBService} from './alarmDB.service'

export class AlarmDBServiceTest {
  private alarmDBModel = model(AlarmDB.name, AlarmDBSchema)

  public alarmDBService = new AlarmDBService(this.alarmDBModel)
}
