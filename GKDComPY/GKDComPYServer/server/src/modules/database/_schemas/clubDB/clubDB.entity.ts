import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class WeekRow {
  @Prop({type: String, required: true})
  weekOId: string

  @Prop({type: Number, required: true})
  start: number

  @Prop({type: Number, required: true})
  end: number

  @Prop({type: String, default: ''})
  title: string
}
export const WeekRowSchema = SchemaFactory.createForClass(WeekRow)

@Schema()
export class Club extends Document {
  /** User ID. Not ObjectId */
  @Prop({type: String, required: true})
  name: string

  @Prop({type: String, required: true})
  commOId: string

  @Prop({type: [WeekRow], default: []})
  weekRowsArr: WeekRow[]

  @Prop({type: String, default: ''})
  chatRoomOId: string

  @Prop({type: String, default: ''})
  docOId: string

  // 대전기록의 이전주차 생성을 마지막에 한 날짜
  // 이전 주차 기록 무한 생성 방지용
  @Prop({type: Number, default: 0})
  lastAddPrevWeekDate: number

  // lastAddPrevWeekDate 때 생성한 이전주차의 개수
  // 이전 주차 기록 무한 생성 방지용.
  @Prop({type: Number, default: 0})
  numOfAddedPrevWeek: number
}
export const ClubSchema = SchemaFactory.createForClass(Club)
