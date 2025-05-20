import {CSSProperties, FC, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Icon, IconFilled} from '../../../common/components'
import {useClubContext} from '../../../contexts'
import {useTemplateStatesContext} from '../../../template/_contexts'

type AddMemberBlockProps = DivCommonProps & {}
export const AddMemberBlock: FC<AddMemberBlockProps> = ({className, ...props}) => {
  const {banClubOId, clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()
  const {setIsAddMemModal} = useClubContext()

  const [clubOId, setClubOId] = useState<string>('')
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const styleIcon: CSSProperties = {
    cursor: 'pointer',
    fontSize: '2.25rem',
    height: '2rem',
    lineHeight: '2.5rem',
    marginLeft: '40px',
    marginTop: '20px',
    userSelect: 'none',
    width: 'fit-content'
  }

  // Init clubOId
  useEffect(() => {
    if (clubIdx !== null && clubIdx >= 0) {
      setClubOId(clubsArr[clubIdx].clubOId)
    } // BLANK LINE COMMENT:
    else {
      setClubOId(banClubOId)
    }
  }, [banClubOId, clubIdx, clubsArr])

  return (
    <div
      className={`w-fit ${className}`}
      onClick={e => setIsAddMemModal(clubOId)}
      onMouseEnter={e => setIsHovered(true)}
      onMouseLeave={e => setIsHovered(false)}
      {...props} // BLANK LINE COMMENT:
    >
      {isHovered ? (
        <IconFilled iconName="person_add" style={styleIcon} />
      ) : (
        <Icon iconName="person_add" style={styleIcon} />
      )}
    </div>
  )
}
