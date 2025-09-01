import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type CommentUserNameFProps = DivCommonProps & {comment: CommentType}

export const CommentUserNameF: FC<CommentUserNameFProps> = ({comment, className, style, ...props}) => {
  const onClickUserName = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`클릭하면 모달 띄워지게 해야돼요.`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`CommentUserName_F ${className || ''}`} style={style} {...props}>
      <p className="_commentUserName" onClick={onClickUserName}>
        {comment.userName}
      </p>
    </div>
  )
}
