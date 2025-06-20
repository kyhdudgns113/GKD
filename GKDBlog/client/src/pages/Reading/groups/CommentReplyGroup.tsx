import {useEffect, useState} from 'react'
import {MarginWidthBlock} from '@component'
import {useModalStatesContext} from '@contexts/modal/__states'
import {SAKURA_BG, SAKURA_BORDER} from '@value'
import {AddReplyBlock, EditReplyBlock, ReplyContentBlock, ReplyHeadBlock} from '../blocks'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType, ReplyType} from '@shareType'

type CommentReplyGroupProps = DivCommonProps & {
  comment: CommentType
  reply: ReplyType
}

/* eslint-disable */
export const CommentReplyGroup: FC<CommentReplyGroupProps> = ({
  comment,
  reply,
  className,
  style,
  ...props
}) => {
  const {editReplyCommentOId, editReplyDateString} = useModalStatesContext()

  const [content, setContent] = useState<string>(reply.content)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isReply, setIsReply] = useState<boolean>(false)

  const styleGroup: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    height: 'fit-content',

    width: '100%'
  }
  const styleHeadAndBody: CSSProperties = {
    backgroundColor: SAKURA_BG,
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',

    display: 'flex',
    flexDirection: 'row',

    height: 'fit-content'
  }
  const styleMain: CSSProperties = {
    backgroundColor: '#FFFFFF',

    borderColor: SAKURA_BORDER,
    borderLeftWidth: '2px',
    display: 'flex',
    flexDirection: 'column',

    height: 'fit-content',

    paddingBottom: '12px',
    paddingLeft: '8px',
    width: '100%'
  }

  // isEditing 상태 변경
  useEffect(() => {
    const sameCommOId = reply.commentOId === editReplyCommentOId
    const sameDate = reply.dateString === editReplyDateString
    if (sameCommOId && sameDate) {
      setIsEditing(true)
    } // ::
    else {
      setIsEditing(false)
    }
  }, [editReplyCommentOId, editReplyDateString, reply])

  return (
    <div className={`COMMENT_REPLY_GROUP ${className || ''}`} style={styleGroup} {...props}>
      {/* 1,2: 헤더, 몸통 */}
      <div style={styleHeadAndBody}>
        <MarginWidthBlock width="32px" />

        <div style={styleMain}>
          {/* 1. 헤더: 이름, 버튼들 */}
          <ReplyHeadBlock reply={reply} setIsReply={setIsReply} />

          {/* 2-1. 몸통_수정중 아닐때: 내용  */}
          {!isEditing && <ReplyContentBlock reply={reply} />}

          {/* 2-2. 몸통_수정중일때: 수정블록 */}
          {isEditing && <EditReplyBlock content={content} reply={reply} setContent={setContent} />}
        </div>
      </div>

      {/* 3. 대댓글 작성란 */}
      {isReply && (
        <AddReplyBlock
          comment={comment}
          setIsReply={setIsReply}
          targetUserName={reply.userName}
          targetUserOId={reply.userOId}
        />
      )}
    </div>
  )
}
/* eslint-enable */
