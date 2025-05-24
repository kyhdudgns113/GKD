import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'
import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {Icon} from '../../../common'

type RowFilePartProps = DivCommonProps & {
  fileOId: string
  tabCnt: number
}

export const RowFilePart: FC<RowFilePartProps> = ({
  fileOId,
  tabCnt,
  className,
  style,
  ...props
}) => {
  const {fileRows} = useDirectoryStatesContext()
  const fileRow = fileRows[fileOId]

  const styleRowPart: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabCnt * 8}px`
  }
  const styleIcon: CSSProperties = {
    fontSize: '22px',
    marginLeft: '4px',
    marginRight: '4px'
  }
  const styleName: CSSProperties = {
    fontSize: '16px',
    marginLeft: '4px'
  }

  return (
    <div
      className={`ROW_FILE_PART file:${fileOId} ${className || ''}`}
      style={styleRowPart}
      {...props} // BLANK LINE COMMENT:
    >
      <Icon iconName="file_present" style={styleIcon} />
      <p style={styleName}>{fileRow.name}</p>
    </div>
  )
}
