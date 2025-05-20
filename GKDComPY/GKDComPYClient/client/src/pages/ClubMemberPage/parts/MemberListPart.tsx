import {CSSProperties, FC, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Text3XL} from '../../../common/components'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {AddMemberBlock, MemberListBlock} from '../blocks'

type MemberListPartProps = DivCommonProps & {
  //
}
export const MemberListPart: FC<MemberListPartProps> = ({className, ...props}) => {
  const {clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()

  const [title, setTitle] = useState<string>('')

  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto'
  }

  useEffect(() => {
    if (clubIdx !== null && clubIdx >= 0) {
      setTitle(`클럽: ${clubsArr[clubIdx]?.name || '---'} 의 멤버 리스트`)
    } // BLANK LINE COMMENT:
    else if (clubIdx === -1) {
      setTitle('탈퇴한 멤버들의 리스트')
    } // BLANK LINE COMMENT:
    else {
      setTitle('---')
    }
  }, [clubIdx, clubsArr])

  return (
    <div className={` ${className}`} style={styleDiv} {...props}>
      <Text3XL className="ml-8">{title}</Text3XL>
      <AddMemberBlock />
      <MemberListBlock className="mt-4 mx-8" />
    </div>
  )
}
