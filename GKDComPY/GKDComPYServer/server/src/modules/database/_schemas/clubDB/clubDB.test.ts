import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {Club, ClubSchema, WeekRow, WeekRowSchema} from './clubDB.entity'
import {ClubDBService} from './clubDB.service'

export class ClubDBServiceTest {
  private clubModel = model(Club.name, ClubSchema)
  private weekRowModel = model(WeekRow.name, WeekRowSchema)
  public clubDBService = new ClubDBService(this.clubModel, this.weekRowModel)
}
