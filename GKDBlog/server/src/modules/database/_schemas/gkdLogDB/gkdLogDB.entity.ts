import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {getTodayValue} from 'src/common/utils'

@Schema()
export class GKDLog extends Document {
  @Prop({
    type: Date,
    default: () => new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Seoul'}))
  })
  date: Date

  @Prop({type: Number, default: getTodayValue()})
  dateValue: number

  @Prop({type: String})
  userOId: string

  @Prop({type: String, required: true})
  userId: string

  @Prop({type: String, required: true})
  where: string

  // 클라이언트로 보내진 에러 메시지
  @Prop({type: Object, default: {}})
  gkd: any

  // 서버에 남길 로그 메시지(에러는 절대 안됨)
  @Prop({type: String, default: ''})
  gkdLog: string

  // 서버에 남길 에러 메시지
  @Prop({type: String, default: ''})
  gkdErr: string

  // 서버에 남길 Fatal 에러 오브젝트
  // 예기치 못한 에러(gkd 에 담지 않은 에러) 는 여기에 담는다.
  @Prop({type: Object, default: {}})
  errObj: any

  // 에러 발생시 status
  // errStatus = {clubOId: 'asdf', uOId: '1232'} 이런식으로
  // Fatal 에러 발생할때는 이걸 넘겨줄 수 없다.
  @Prop({type: Object, default: {}})
  gkdStatus: any
}
export const GKDLogSchema = SchemaFactory.createForClass(GKDLog)
