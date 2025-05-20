import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../common'
import {ClubsArrPart, HeadPart} from './parts'

type EntireMemberPageLayoutProps = DivCommonProps & {}

export const EntireMemberPageLayout: FC<EntireMemberPageLayoutProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '24px',
    paddingLeft: '24px'
  }
  return (
    <div className={`E_MEMBER_PAGE ${className || ''}`} style={styleDiv} {...props}>
      <HeadPart />
      <ClubsArrPart />
    </div>
  )
}
