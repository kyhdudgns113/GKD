import {useReadingPageStatesContext} from '../_contexts/__states'
import {FileContentsPart} from '../parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import {SAKURA_BORDER} from '@value'
import {MarginHeightBlock} from '@components/MarginBlocks'

type EntireFileSPProps = DivCommonProps & {width?: string}

/**
 * 파일 읽을때 파일 내용을 보여주는 컴포넌트이다.
 * 1. 타이틀
 * 2. 파일 내용
 */
export const EntireFileSP: FC<EntireFileSPProps> = ({width, className, style, ...props}) => {
  const {file} = useReadingPageStatesContext()

  const styleSP: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    width: width || '900px'
  }

  const styleTitle: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '2px',
    borderWidth: '1px',

    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px'
  }

  return (
    <div className={`ENTIRE_FILE_SP ${className || ''}`} style={styleSP} {...props}>
      {/* 0. 스타일 */}

      {/* 1. 타이틀 */}
      <p style={styleTitle}>{file.name}</p>

      <MarginHeightBlock height="20px" />

      {/* 2. 파일 내용 */}
      <FileContentsPart />
    </div>
  )
}
