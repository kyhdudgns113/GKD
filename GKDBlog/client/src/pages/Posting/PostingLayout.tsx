import {MarginWidthBlock} from '@component'
import {FileProvider} from './_contexts'
import {SetDirAndFilesPart, SelectedFilePart} from './parts'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type PostingPageLayoutProps = DivCommonProps & {}

// BLANK LINE COMMENT:
export const PostingPageLayout: FC<PostingPageLayoutProps> = ({className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',

    paddingLeft: '20px',
    width: '1700px'
  }

  return (
    <div className={`SET_DIRECTORY_PART ${className || ''}`} style={stylePage} {...props}>
      {/* 1. 파일 및 폴더 설정 파트 */}
      <SetDirAndFilesPart width="240px" />

      <MarginWidthBlock className="POSTING_LAYOUT_MARGIN_1 " width="40px" />

      {/* 2. 선택한 파일 수정 파트 */}
      <FileProvider>
        <SelectedFilePart width="800px" />
      </FileProvider>
    </div>
  )
}
