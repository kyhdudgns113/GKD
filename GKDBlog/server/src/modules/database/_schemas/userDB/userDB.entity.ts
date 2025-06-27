import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {SignUpType} from 'src/common/types'

@Schema()
export class UserDB extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: String})
  picture: string

  @Prop({type: String, required: true})
  signUpType: SignUpType

  /** User ID. Not ObjectId */
  @Prop({type: String, unique: true})
  userId: string

  /**
   * 홈페이지에 표기되는건 userName 이다.
   * - 따라서 고유한 값을 가져야 한다.
   */
  @Prop({type: String, unique: true})
  userName: string

  @Prop({type: String})
  hashedPassword: string

  @Prop({type: Number, default: 1})
  userAuth: number
}

export const UserDBSchema = SchemaFactory.createForClass(UserDB)
