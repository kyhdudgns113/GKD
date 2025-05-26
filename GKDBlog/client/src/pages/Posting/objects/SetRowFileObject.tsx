import {useEffect, useState} from 'react'
import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {Icon} from '../../../common'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'
type SetRowFileObjectProps = DivCommonProps & {
  fileOId: string
  tabLevel: number
}

export const SetRowFileObject: FC<SetRowFileObjectProps> = ({
  fileOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {fileRows} = useDirectoryStatesContext()

  const [fileName, setFileName] = useState<string>('--')

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

  // Set file name
  useEffect(() => {
    if (!fileRows[fileOId]) {
      setFileName('로딩중...-')
    } // BLANK LINE COMMENT:
    else {
      setFileName(fileRows[fileOId].name)
    }
  }, [fileOId, fileRows])

  return (
    <div className={`SET_ROW_FILE_OBJECT ${className || ''}`} style={styleRow} {...props}>
      <Icon iconName="file_present" style={styleIcon} />
      <p>{fileName}</p>
    </div>
  )
}
