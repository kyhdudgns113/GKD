import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class RecordBlock {
  @Prop({type: Number, default: 0})
  result: number

  @Prop({type: Boolean, default: false})
  useClientLineUp: boolean
}
export const RecordBlockSchema = SchemaFactory.createForClass(RecordBlock)

@Schema()
export class DailyRecord extends Document {
  @Prop({type: String, required: true})
  clubOId: string

  @Prop({type: String, default: null})
  memOId: string | null

  @Prop({type: String, required: true})
  name: string

  @Prop({type: Number, required: true})
  date: number

  @Prop({type: Number, default: 0})
  condError: number

  @Prop({type: String, default: ''})
  comment: string

  @Prop({type: [RecordBlock], required: true})
  recordsArr: RecordBlock[]
}
export const DailyRecordSchema = SchemaFactory.createForClass(DailyRecord)
