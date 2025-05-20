import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {Community, CommunitySchema} from './communityDB.entity'
import {CommunityDBService} from './communityDB.service'

export class CommunityDBServiceTest {
  private commModel = model(Community.name, CommunitySchema)
  public communityDBService = new CommunityDBService(this.commModel)
}
