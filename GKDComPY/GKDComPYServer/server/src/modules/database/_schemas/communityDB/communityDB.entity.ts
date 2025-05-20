import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class Community extends Document {
  /** Object Id is in extended class Document */

  /** User ID. Not ObjectId */
  @Prop({type: String, required: true, unique: true})
  name: string

  /**
   * 지울까 말까 고민을 했다 \
   * 권한값을 여기서 갖고 있는게 낫다고 판단했다 \
   * User 가 자신의 권한값을 가지고 있으면 조작의 위험등이 있을 수 있다 \
   * User 는 자신의 권한값을 굳이 가지고 있어야 할 이유가 없다 \
   * 라고 생각했으나 이렇게 하면 유저 권한 갱신할때 comm 를 통째로 전달해야 한다 \
   *  - 라고 생각했으나 권한값만 읽어와서 클라로 전송하면 된다.
   *  - 논리적으로 권한값은 공동체가 갖고 있는게 맞다.
   */
  @Prop({type: Object, default: {}, required: false, unique: false})
  users: {[uOId: string]: number}

  /**
   * 이것도 지울까 고민을 했다 \
   * 클럽들의 우선순위는 필요하다 \
   * 그런데 우선순위값은 어차피 중복이 될 필요가 없다 \
   * 따라서 그냥 배열에다가 넣기로 했다
   */
  // @Prop({type: Object, default: {}, required: false, unique: false})
  // clubs: {[clubOId: string]: number}
  @Prop({type: [String], default: [], required: false, unique: false})
  clubOIdsArr: string[]

  @Prop({type: String, default: '', required: false, unique: false})
  banClubOId: string

  @Prop({type: Number, default: 5, required: false, unique: false})
  maxUsers: number

  @Prop({type: Number, default: 5, required: false, unique: false})
  maxClubs: number
}

export const CommunitySchema = SchemaFactory.createForClass(Community)
