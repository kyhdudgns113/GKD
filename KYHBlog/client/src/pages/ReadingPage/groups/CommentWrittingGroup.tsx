import {useCallback, useMemo, useRef} from 'react'
import {useAuthStatesContext, useFileStatesContext} from '@context'
import {AUTH_GUEST} from '@secret'

import type {ChangeEvent, CSSProperties, FC, FocusEvent, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type CommentWrittingGroupProps = DivCommonProps

export const CommentWrittingGroup: FC<CommentWrittingGroupProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const {comment, setComment} = useFileStatesContext()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const styleDiv: CSSProperties = useMemo(() => {
    return {
      ...style,
      cursor: userAuth === AUTH_GUEST ? 'default' : 'text'
    }
  }, [userAuth, style])

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickContainer = useCallback(
    (userAuth: number) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      if (userAuth === AUTH_GUEST) {
        alert(`로그인 이후 이용할 수 있어요`)
        setComment('')
        textareaRef.current?.blur()
        return
      }

      textareaRef.current?.focus()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onFocusComment = useCallback(
    (userAuth: number) => (e: FocusEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userAuth === AUTH_GUEST) {
        alert(`로그인 이후 이용할 수 있어요`)
        setComment('')
        textareaRef.current?.blur()
        return
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div
      className={`CommentWritting_Group  ${className || ''}`}
      onClick={onClickContainer(userAuth)}
      style={styleDiv}
      {...props} // ::
    >
      <textarea
        className="_writtingComment"
        disabled={userAuth === AUTH_GUEST}
        onChange={onChangeComment}
        onClick={e => e.stopPropagation()}
        onFocus={onFocusComment(userAuth)}
        ref={textareaRef}
        value={comment} // ::
      />
    </div>
  )
}
