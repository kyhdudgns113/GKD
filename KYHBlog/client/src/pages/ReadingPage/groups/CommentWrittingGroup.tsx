import {useCallback, useRef} from 'react'

import {useFileStatesContext} from '@context'
import type {FC} from 'react'
import type {ChangeEvent} from 'react'
import type {DivCommonProps} from '@prop'

type CommentWrittingGroupProps = DivCommonProps

export const CommentWrittingGroup: FC<CommentWrittingGroupProps> = ({className, style, ...props}) => {
  const {comment, setComment} = useFileStatesContext()

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onClickContainer = useCallback(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <div
      className={`CommentWritting_Group ${className || ''}`}
      onClick={onClickContainer}
      style={style}
      {...props} // ::
    >
      <textarea
        className="_writtingComment"
        onChange={onChangeComment}
        onClick={e => e.stopPropagation()}
        ref={textareaRef}
        value={comment} // ::
      />
    </div>
  )
}
