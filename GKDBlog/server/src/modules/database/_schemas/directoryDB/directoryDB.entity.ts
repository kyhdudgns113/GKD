import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class DirectoryDB extends Document {
  @Prop({type: String, required: true})
  dirName: string

  @Prop({type: [String], default: []})
  fileOIdsArr: string[]

  /**
   * 부모 디렉토리의 ObjectId
   * - 내가 루트디렉토리면 'NULL'
   */
  @Prop({type: String, required: true})
  parentDirOId: string

  @Prop({type: [String], default: []})
  subDirOIdsArr: string[]
}

export const DirectoryDBSchema = SchemaFactory.createForClass(DirectoryDB)
