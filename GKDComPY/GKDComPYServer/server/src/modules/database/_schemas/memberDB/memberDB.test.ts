import {Injectable} from '@nestjs/common'
import {model, Model} from 'mongoose'
import {Card, CardSchema, Member, MemberSchema} from './memberDB.entity'
import {MemberDBService} from './memberDB.service'

export class MemberDBServiceTest {
  private readonly memberModel = model(Member.name, MemberSchema)
  private readonly cardModel = model(Card.name, CardSchema)

  public memberDBService = new MemberDBService(this.memberModel, this.cardModel)
}
