import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {GKDLog, GKDLogSchema} from './gkdLogDB.entity'
import {GKDLogDBService} from './gkdLogDB.service'

export class GKDLogDBServiceTest {
  private logModel = model(GKDLog.name, GKDLogSchema)

  public logDBService = new GKDLogDBService(this.logModel)
}
