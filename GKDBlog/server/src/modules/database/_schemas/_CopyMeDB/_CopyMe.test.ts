import {model} from 'mongoose'
import {___CopyMe, ___CopyMeSchema} from './_CopyMe.entity'
import {___CopyMeService} from './_CopyMe.service'

export class CopyMeServiceTest {
  private copyMeModel = model(___CopyMe.name, ___CopyMeSchema)

  public copyMeService = new ___CopyMeService(this.copyMeModel)
}
