import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'

@Injectable()
export class ___Service {
  constructor() {}

  async copyMePost(jwtPayload: JwtPayloadType, copyData: any) {
    try {
      return {ok: true, body: {}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }

  async copyMeGet(jwtPayload: JwtPayloadType, testArg: any) {
    try {
      return {ok: true, body: {}, errObj: {}}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      return {ok: false, body: {}, errObj}
    }
  }
}
