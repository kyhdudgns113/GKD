import {useCallback, useEffect, useRef, useState} from 'react'
import {useFileStatesContext} from '@context'
import {SubmitEditCommentButton} from '../buttons'
import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {ChangeEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentContentFProps = DivCommonProps & {comment: CommentType}

/**
 * 댓글의 내용과 수정중이면 제출버튼을 표시하는 컴포넌트이다.
 *
 *   - 수정중이 아니면 댓글의 내용만 표시한다
 *   - 수정중이면 수정중인 내용, 댓글 길이, 제출버튼이 표시된다
 */
export const CommentContentF: FC<CommentContentFProps> = ({comment, className, style, ...props}) => {
  const {commentOId_edit} = useFileStatesContext()

  const [content, setContent] = useState<string>('')

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const isEditing = commentOId_edit === comment.commentOId

  const _resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    _resizeTextarea()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 초기화: content
   *   - commentOId_edit 가 변경되면 content 를 초기화한다.
   */
  useEffect(() => {
    setContent(comment.content)
  }, [commentOId_edit]) // eslint-disable-line react-hooks/exhaustive-deps

  // 자동 초기화: textarea 높이
  useEffect(() => {
    _resizeTextarea()
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`CommentContent_F ${className || ''}`} style={style} {...props}>
      {/* 1. 댓글 내용(수정중이지 않은 경우) */}
      {!isEditing && <div className="_commentContent">{comment.content}</div>}

      {/* 2. 수정중인 댓글 내용(수정중인 경우) */}
      {isEditing && <textarea className="_commentContent" onChange={onChangeContent} ref={textareaRef} value={content} />}

      {/* 3. 댓글 길이 표시, 제출 버튼(수정중인 경우) */}
      {isEditing && (
        <div className="_editing_extra_row">
          <div className="__editing_comment_length">
            {content.length} / {COMMENT_MAX_LENGTH}
          </div>
          <SubmitEditCommentButton comment={comment} content={content} />
        </div>
      )}
    </div>
  )
}
