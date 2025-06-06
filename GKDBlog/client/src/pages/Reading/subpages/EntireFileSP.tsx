import {useReadingPageStatesContext} from '../_contexts/__states'
import {FileContentsPart} from '../parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type EntireFileSPProps = DivCommonProps & {width?: string}

export const EntireFileSP: FC<EntireFileSPProps> = ({width, className, style, ...props}) => {
  const {file} = useReadingPageStatesContext()

  const styleSP: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    minHeight: '400px',

    width: width || '800px'
  }

  const styleTitle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px'
  }

  return (
    <div className={`ENTIRE_FILE_SP ${className || ''}`} style={styleSP} {...props}>
      {/* 0. 스타일 */}

      {/* 1. 타이틀 */}
      <p style={styleTitle}>{file.name}</p>

      {/* 2. 파일 내용 */}
      <FileContentsPart />
    </div>
  )
}
