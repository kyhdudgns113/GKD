import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {SignUpType} from 'src/common/types'

@Schema()
export class User extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: String})
  picture: string

  @Prop({type: String, required: true})
  signUpType: SignUpType

  /** User ID. Not ObjectId */
  @Prop({type: String, unique: true})
  userId: string

  @Prop({type: String, unique: true})
  userName: string

  @Prop({type: String})
  hashedPassword: string

  @Prop({type: Number, default: 1})
  userAuth: number
}

export const UserSchema = SchemaFactory.createForClass(User)
