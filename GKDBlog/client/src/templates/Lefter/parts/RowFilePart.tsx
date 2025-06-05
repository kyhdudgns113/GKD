import {useEffect, useState} from 'react'
import {Icon} from '@component'
import {useDirectoryStatesContext} from '@contexts/directory/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

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

  const [fileName, setFileName] = useState<string>('--')

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

  // Set file name
  useEffect(() => {
    if (!fileRows[fileOId]) {
      setFileName('로딩중...')
    } // BLANK LINE COMMENT:
    else {
      setFileName(fileRows[fileOId].name)
    }
  }, [fileOId, fileRows])

  return (
    <div
      className={`ROW_FILE_PART file:${fileOId} ${className || ''}`}
      style={styleRowPart}
      {...props} // BLANK LINE COMMENT:
    >
      <Icon iconName="file_present" style={styleIcon} />
      <p style={styleName}>{fileName}</p>
    </div>
  )
}
