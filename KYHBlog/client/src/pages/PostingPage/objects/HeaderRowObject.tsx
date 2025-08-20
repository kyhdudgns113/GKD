import {useDirectoryStatesContext} from '@context'
import {AddDirButton, AddFileButton, RefreshButton} from '../buttons'

import '../_styles/HeaderRowObject.scss'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderRowObjectProps = DivCommonProps & {}

export const HeaderRowObject: FC<HeaderRowObjectProps> = ({className, style, ...props}) => {
  const {rootDirOId} = useDirectoryStatesContext()

  const styleObject: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row'
  }
  return (
    <div className={`HeaderRow_Object ${className || ''}`} style={styleObject} {...props}>
      <AddDirButton dirOId={rootDirOId} style={{marginLeft: 'auto'}} />
      <AddFileButton dirOId={rootDirOId} />
      <RefreshButton />
    </div>
  )
}
