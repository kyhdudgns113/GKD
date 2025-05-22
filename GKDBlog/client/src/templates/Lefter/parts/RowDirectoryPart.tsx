import {useDirectoryStatesContext} from '../../../contexts/directory/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'

type RowDirectoryPartProps = DivCommonProps & {dirOId: string; tabCnt: number}

export const RowDirectoryPart: FC<RowDirectoryPartProps> = ({
  dirOId,
  tabCnt,
  className,
  style,
  ...props
}) => {
  const {directories} = useDirectoryStatesContext()

  const styleRow: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    fontSize: '16px',
    marginLeft: `${tabCnt * 8}px`
  }

  return (
    <div className={`ROW_DIRECTORY_PART ${className || ''}`} style={styleRow} {...props}>
      <p>{directories[dirOId]?.dirName || '이름에러'}</p>
    </div>
  )
}
