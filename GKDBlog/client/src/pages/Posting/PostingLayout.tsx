import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../common/typesAndValues/props'
import {SetDirAndFilesPart} from './parts'

type PostingLayoutProps = DivCommonProps & {}

export const PostingLayout: FC<PostingLayoutProps> = ({className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    paddingLeft: '20px',
    width: '1700px'
  }

  return (
    <div className={`SET_DIRECTORY_PART ${className || ''}`} style={stylePage} {...props}>
      <SetDirAndFilesPart width="240px" />
    </div>
  )
}
