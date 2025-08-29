import {useFileStatesContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderNameObjectProps = DivCommonProps

export const HeaderNameObject: FC<HeaderNameObjectProps> = ({className, style, ...props}) => {
  const {file} = useFileStatesContext()

  return (
    <div className={`HeaderName_Object ${className || ''}`} style={style} {...props}>
      <p className="_fileName">{file.fileName}</p>
    </div>
  )
}
