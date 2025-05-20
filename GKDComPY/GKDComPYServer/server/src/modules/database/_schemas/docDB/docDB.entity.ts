import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class GDocument extends Document {
  @Prop({type: String, default: null})
  clubOId: string | null

  @Prop({type: [String], default: []})
  contents: string[]
}
export const GDocumentSchema = SchemaFactory.createForClass(GDocument)
