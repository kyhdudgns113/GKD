import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class Card {
  /**
   * 스킬만 바꾼 상태일때 이름이 null 이게 된다.
   */
  @Prop({type: String, default: null, required: false, unique: false})
  name: string | null

  @Prop({type: Number, required: true, unique: false})
  posIdx: number

  @Prop({type: [Number], default: [0, 1, 2], required: false, unique: false})
  skillIdxs: number[]

  @Prop({type: [Number], default: [0, 0, 0], required: false, unique: false})
  skillLevels: number[]
}
export const CardSchema = SchemaFactory.createForClass(Card)

@Schema()
export class Member extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: String, required: true, unique: false})
  name: string

  // Legacy 멤버 찾을때 쓴다.
  @Prop({type: String, required: true, unique: false})
  commOId: string

  @Prop({type: String, required: true, unique: false})
  clubOId: string | null

  @Prop({type: Number, default: 0})
  position: number

  @Prop({type: Number, required: false, unique: false})
  lastRecorded: number | null

  @Prop({type: Number, required: false, unique: false})
  batterPower: number | null

  @Prop({type: Number, required: false, unique: false})
  pitcherPower: number | null

  @Prop({
    type: [CardSchema],
    default: () =>
      Array(25)
        .fill(null)
        .map((nill, idx) => {
          return {
            name: null,
            posIdx: idx + 1,
            skillIdxs: [0, 1, 2],
            skillLevels: [0, 0, 0]
          }
        }),
    required: false,
    unique: false
  })
  deck: Card[]

  @Prop({type: String, default: ''})
  memberComment: string
}
export const MemberSchema = SchemaFactory.createForClass(Member)
