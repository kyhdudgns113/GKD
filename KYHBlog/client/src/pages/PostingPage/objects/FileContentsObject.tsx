import {useFileStatesContext} from '@contexts/file'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type FileContentsObjectProps = DivCommonProps

export const FileContentsObject: FC<FileContentsObjectProps> = ({className, style, ...props}) => {
  const {content} = useFileStatesContext()

  return (
    <div className={`FileContents_Object ${className || ''}`} style={style} {...props}>
      {content}
    </div>
  )
}
