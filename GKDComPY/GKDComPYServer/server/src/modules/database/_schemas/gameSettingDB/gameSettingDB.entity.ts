import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class GameSettingDB extends Document {
  @Prop({type: Number, default: 2})
  bigBlind: number

  @Prop({type: Number, default: 100})
  rebuy: number

  @Prop({type: Number, default: 1})
  smallBlind: number
}
export const GameSettingDBSchema = SchemaFactory.createForClass(GameSettingDB)
