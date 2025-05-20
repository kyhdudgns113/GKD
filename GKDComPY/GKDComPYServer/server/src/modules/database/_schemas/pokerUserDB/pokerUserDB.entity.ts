import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class PokerUser extends Document {
  @Prop({type: Number, default: 0})
  bankroll: number

  @Prop({type: Date, default: new Date()})
  createdAt: Date

  @Prop({type: Number, default: 0})
  debts: number

  @Prop({type: String, required: true})
  name: string
}
export const PokerUserSchema = SchemaFactory.createForClass(PokerUser)
