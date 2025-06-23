import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'

import * as T from '@common/types'

/**
 *
 */
@Injectable()
export class SocketPortService {
  constructor(private readonly dbHubService: DatabaseHubService) {}

  async alarmReadingComment(fileUserOId: string, _comment: T.CommentType) {
    /**
     * 댓글이 달렸으므로 알람을 보내는 함수이다.
     *
     * 1. 유저가 존재하는지 췍!!
     * 2. 댓글이 존재하는지 OId 로 췍!!
     * 3. ReadingComment 알람을 생성한다.
     * 4. 수신 확인이 안 된 알람들을 불러온다.
     * 5. 수신 확인이 안 된 알람들의 갯수를 리턴한다.
     */
    const where = `/socket/alarmReadingComment`
    try {
      const {commentOId} = _comment

      // 1. 유저가 존재하는지 췍!!
      const {user} = await this.dbHubService.readUserByUserOId(where, fileUserOId)
      if (!user) {
        throw new Error('유저가 존재하지 않습니다.')
      }

      // 2. 댓글이 존재하는지 OId 로 췍!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw new Error('댓글이 존재하지 않습니다.')
      }

      // 3. Reading Comment 알람을 생성 뙇!!
      await this.dbHubService.createAlarmReadingComment(where, fileUserOId, comment)

      // 4. 수신 확인이 안 된 알람들을 뙇!!
      const {alarmArr} = await this.dbHubService.readAlarmArrNotReceived(where, fileUserOId)

      // 5. 수신 확인이 안 된 알람들의 갯수를 리턴 뙇!!
      const newAlarmArrLen = alarmArr.length
      return {newAlarmArrLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
