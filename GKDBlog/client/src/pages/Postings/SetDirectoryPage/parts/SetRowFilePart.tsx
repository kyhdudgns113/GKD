import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../../common'
import {useDirectoryStatesContext} from '../../../../contexts/directory/__states'

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
    marginLeft: `${tabLevel * 8}px`
  }

  return (
    <div className={`SET_ROW_FILE_PART ${className || ''}`} style={styleRow} {...props}>
      <p>File: {fileRow.name}</p>
    </div>
  )
}
