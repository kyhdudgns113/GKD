import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {MarginHeightBlock} from '@component'
import {useReadingPageStatesContext} from './_contexts/__states'

import {CommentsSP, EntireFileSP} from './subpages'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import {widthPage} from '@value'

type ReadingPageLayoutProps = DivCommonProps & {}

export const ReadingPageLayout: FC<ReadingPageLayoutProps> = ({className, style, ...props}) => {
  const {setFileOId} = useReadingPageStatesContext()

  const location = useLocation()

  const stylePage: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    paddingLeft: '20px',
    width: widthPage
  }

  // url 에서 fileOId 를 가져온다.
  useEffect(() => {
    const fileOId = location.pathname.split('reading/')[1]
    setFileOId(fileOId)
  }, [location, setFileOId])

  return (
    <div className={`READING_PAGE_LAYOUT ${className || ''}`} style={stylePage} {...props}>
      <MarginHeightBlock height="48px" />

      {/* 1. 파일 내용 */}
      <EntireFileSP width="900px" />

      <MarginHeightBlock height="48px" />

      {/* 2. 댓글작성 및 댓글+대댓글 목록 */}
      <CommentsSP />
    </div>
  )
}
