import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../../common'
import {useDirectoryStatesContext} from '../../../../contexts/directory/__states'
import {Icon} from '../../../../common'

type SetRowFilePartProps = DivCommonProps & {
  fileOId: string
  tabLevel: number
}

export const SetRowFilePart: FC<SetRowFilePartProps> = ({
  fileOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {fileRows} = useDirectoryStatesContext()
  const fileRow = fileRows[fileOId]

  const styleRow: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabLevel * 8}px`
  }
  const styleIcon: CSSProperties = {
    fontSize: '22px',
    marginLeft: '4px',
    marginRight: '4px'
  }

  return (
    <div className={`SET_ROW_FILE_PART ${className || ''}`} style={styleRow} {...props}>
      <Icon iconName="file_present" style={styleIcon} />
      <p>{fileRow.name}</p>
    </div>
  )
}
