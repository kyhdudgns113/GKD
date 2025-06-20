import {useEffect, useState} from 'react'

import {AddReplyBlock} from '../blocks'
import {CommentFixGroup, CommentHeadGroup, CommentReplyGroup, CommentShowGroup} from '../groups'

import {useModalStatesContext} from '@contexts/modal/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentObjectProps = DivCommonProps & {
  comment: CommentType
}

/**
 * 하나의 댓글과 관련된 컴포넌트다
 */
export const CommentObject: FC<CommentObjectProps> = ({comment, className, style, ...props}) => {
  const {editCommentOId} = useModalStatesContext()

  const [content, setContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isReply, setIsReply] = useState<boolean>(false)

  const styleBlock: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    width: '100%'
  }

  // useEffect AREA:

  // isReply
  useEffect(() => {
    setIsReply(false)
  }, [])

  // isEditing
  useEffect(() => {
    setIsEditing(editCommentOId === comment.commentOId)
  }, [comment, editCommentOId])

  // content(댓글 내용 수정때 사용) 초기화
  useEffect(() => {
    setContent(comment.content)
  }, [comment])

  return (
    <div
      className={`COMMENT_BLOCK ${className || ''}`}
      style={styleBlock}
      {...props} // ::
    >
      {/* 1. 댓글 헤더: 이름, 수정, 삭제, 댓글 버튼 */}
      <CommentHeadGroup comment={comment} setContent={setContent} setIsReply={setIsReply} />

      {/* 2-1. 댓글 내용: 수정중 아닐때 */}
      {!isEditing && <CommentShowGroup comment={comment} />}

      {/* 2-2. 댓글 내용: 수정중일때 */}
      {isEditing && <CommentFixGroup comment={comment} content={content} setContent={setContent} />}

      {/* 3, 대댓글 작성하는 부분 */}
      {isReply && (
        <AddReplyBlock
          comment={comment}
          setIsReply={setIsReply}
          targetUserName={comment.userName}
          targetUserOId={comment.userOId}
        />
      )}

      {/* 4. 대댓글 배열 */}
      {comment.replyArr.map((reply, replyIdx) => (
        <CommentReplyGroup key={replyIdx} comment={comment} reply={reply} />
      ))}
    </div>
  )
}
