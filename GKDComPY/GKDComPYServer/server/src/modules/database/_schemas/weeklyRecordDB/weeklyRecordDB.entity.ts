import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

// AREA2: Row Info
@Schema()
export class RecordMemberInfo {
  @Prop({type: String, default: ''})
  memOId: string

  @Prop({type: String, required: false})
  name: string

  @Prop({type: Number, default: 0})
  position: number

  @Prop({type: Number, default: null})
  batterPower: number | null

  @Prop({type: Number, default: null})
  pitcherPower: number | null
}
export const RecordMemberInfoSchema = SchemaFactory.createForClass(RecordMemberInfo)

@Schema()
export class RecordRowInfo {
  /**
   * 나중에 수정, 확장할때를 대비하여 저장해둔다.
   */
  @Prop({type: String, required: true})
  clubOId: string

  @Prop({type: [RecordMemberInfo], default: []})
  membersInfo: RecordMemberInfo[]
}
export const RecordRowInfoSchema = SchemaFactory.createForClass(RecordRowInfo)

// AREA3: Col Info
@Schema()
export class RecordDateInfo {
  @Prop({type: String, required: true})
  clubOId: string

  @Prop({type: Number, required: true})
  date: number

  @Prop({type: String, default: ''})
  enemyName: string

  @Prop({type: Number, default: null})
  pitchOrder: number | null

  @Prop({type: String, default: ''})
  order: string

  @Prop({type: String, default: ''})
  result: string

  @Prop({type: Number, default: null})
  tropy: number | null

  @Prop({type: Number, default: null})
  points: number | null

  @Prop({type: String, default: ''})
  comments: string
}
export const RecordDateInfoSchema = SchemaFactory.createForClass(RecordDateInfo)

@Schema()
export class RecordColInfo {
  @Prop({type: String, required: true})
  clubOId: string

  /**
   * clubOId 를 포함해야 하기에 자동생성을 해선 안된다.
   * 직접 만들어서 넣어주자.
   */
  @Prop({type: [RecordDateInfo], default: [], required: true})
  dateInfo: RecordDateInfo[]
}
export const RecordColInfoSchema = SchemaFactory.createForClass(RecordColInfo)

// AREA4: Weekly Info
@Schema()
export class WeeklyRecord extends Document {
  @Prop({type: String, required: true})
  clubOId: string

  @Prop({type: Number, required: true})
  start: number

  @Prop({type: Number, required: true})
  end: number

  @Prop({type: String, default: ''})
  title: string

  @Prop({type: String, default: ''})
  comment: string

  @Prop({type: RecordRowInfo, default: () => {}})
  rowInfo: RecordRowInfo

  @Prop({type: RecordColInfo, default: () => {}})
  colInfo: RecordColInfo
}
export const WeeklyRecordSchema = SchemaFactory.createForClass(WeeklyRecord)
