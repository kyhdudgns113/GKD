import {Icon} from '@component'

import '../_styles/DirectoryViewPart.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as ST from '@shareType'
import {FileStatus} from '../components'

type FileInfoGroupProps = DivCommonProps & {fileRow: ST.FileRowType}

export const FileInfoGroup: FC<FileInfoGroupProps> = ({fileRow, className, style, ...props}) => {
  return (
    <div
      className={`FileInfo_Group _info_group ${className || ''}`}
      style={style}
      {...props} // ::
    >
      <Icon iconName="article" style={{fontSize: '18px', marginLeft: '4px', marginRight: '4px'}} />
      <p className="_file_name">{fileRow.fileName}</p>

      <FileStatus fileOId={fileRow.fileOId} />
    </div>
  )
}
