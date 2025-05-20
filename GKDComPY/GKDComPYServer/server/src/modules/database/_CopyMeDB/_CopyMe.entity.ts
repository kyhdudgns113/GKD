import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class ___CopyMe extends Document {
  /** Object Id is in extended class Document */

  /** User ID. Not ObjectId */
  @Prop({type: String, unique: true})
  id: string

  @Prop({type: String})
  hashedPassword: string

  @Prop({type: Object, default: {}})
  authority: {[clubOId: string]: number}
}

export const ___CopyMeSchema = SchemaFactory.createForClass(___CopyMe)
