import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class DirectoryDB extends Document {
  @Prop({type: String, required: true})
  dirName: string

  @Prop({type: [String], default: []})
  fileOIDsArr: string[]

  @Prop({type: [String], default: []})
  subdirOIDsArr: string[]
}

export const DirectoryDBSchema = SchemaFactory.createForClass(DirectoryDB)
