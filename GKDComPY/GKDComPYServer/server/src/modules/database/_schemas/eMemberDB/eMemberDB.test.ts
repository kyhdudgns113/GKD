import {model} from 'mongoose'
import {EMember, EMemberArr, EMemberArrSchema, EMemberSchema} from './eMemberDB.entity'
import {EMemberDBService} from './eMemberDB.service'

export class EMemberDBServiceTest {
  private arrModel = model(EMemberArr.name, EMemberArrSchema)
  private memberModel = model(EMember.name, EMemberSchema)

  public eMemberDBService = new EMemberDBService(this.memberModel, this.arrModel)
}
