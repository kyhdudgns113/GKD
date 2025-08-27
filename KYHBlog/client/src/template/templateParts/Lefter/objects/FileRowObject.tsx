import {useDirectoryStatesContext} from '@context'
import {FileInfoGroup} from '../groups'

import '../_styles/DirectoryViewPart.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type FileRowObjectProps = DivCommonProps & {fileOId: string}

export const FileRowObject: FC<FileRowObjectProps> = ({fileOId, className, style, ...props}) => {
  const {fileRows} = useDirectoryStatesContext()

  return (
    <div className={`FileRow_Object _object ${className || ''}`} style={style} {...props}>
      <FileInfoGroup fileName={fileRows[fileOId].fileName} />
    </div>
  )
}
