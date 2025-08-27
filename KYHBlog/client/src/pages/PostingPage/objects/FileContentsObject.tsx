import {useFileStatesContext} from '@contexts/file'

import '../_styles/FileContentsObject.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type FileContentsObjectProps = DivCommonProps

export const FileContentsObject: FC<FileContentsObjectProps> = ({className, style, ...props}) => {
  const {content, setContent} = useFileStatesContext()

  return (
    <div className={`FileContents_Object ${className || ''}`} style={style} {...props}>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
    </div>
  )
}
