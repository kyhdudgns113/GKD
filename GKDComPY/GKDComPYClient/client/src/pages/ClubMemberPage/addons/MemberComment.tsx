import {ChangeEvent, CSSProperties, FC, FocusEvent, useCallback, useEffect, useState} from 'react'
import {TextareaCommonProps} from '../../../common'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {Textarea} from '../../../common/components'
import {useClubMemberCallbacksContext} from '../_contexts'

type MemberCommentProps = TextareaCommonProps & {
  member: MemberInfoType
}

export const MemberComment: FC<MemberCommentProps> = ({member, className, ...props}) => {
  const {changeMemberComment} = useClubMemberCallbacksContext()

  const [comment, setComment] = useState<string>('')
  const [isChanged, setIsChanged] = useState<boolean>(false)

  const styleTArea: CSSProperties = {
    backgroundColor: 'white',

    borderRadius: '8px',

    marginTop: '16px'
  }

  const onBlurComment = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      if (isChanged) {
        setIsChanged(false)
        changeMemberComment(member.memOId, e.currentTarget.value)
      }
    },
    [isChanged, member, changeMemberComment]
  )

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsChanged(true)
    setComment(e.currentTarget.value)
  }, [])

  // Init comment
  useEffect(() => {
    setComment(member.memberComment)
  }, [member])

  return (
    <Textarea
      className={`${className}`}
      onBlur={onBlurComment}
      onChange={onChangeComment}
      style={styleTArea}
      value={comment}
      {...props} // BLANK LINE COMMENT:
    />
  )
}
