import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {EMemberType} from 'src/common/types'

@Schema()
export class EMember {
  @Prop({type: Number})
  batterPower: number | null

  @Prop({type: String})
  clubOId: string

  // 이전 클럽의 colIdx 이다.
  // 사이드바에 있는 rowIdx 랑 다르다.
  // 후보군의 colIdx 가 가장 크다.
  @Prop({type: Number})
  colIdx: number

  @Prop({type: String})
  commOId: string

  @Prop({type: String})
  memberComment: string

  @Prop({type: String})
  memOId: string

  @Prop({type: String})
  name: string

  @Prop({type: Number})
  position: number

  @Prop({type: Number})
  pitcherPower: number | null
}
export const EMemberSchema = SchemaFactory.createForClass(EMember)

@Schema()
export class EMemberArr extends Document {
  @Prop({type: String, required: true})
  commOId: string

  @Prop({type: String, required: true})
  clubOId: string

  @Prop({type: String, required: true})
  colIdx: number

  @Prop({type: [EMember], default: []})
  eMembersArr: EMemberType[]
}
export const EMemberArrSchema = SchemaFactory.createForClass(EMemberArr)
