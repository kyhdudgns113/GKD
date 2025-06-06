import {useEffect} from 'react'
import {MarginHeightBlock} from '@component'
import {useReadingPageStatesContext} from './_contexts/__states'

import {EntireFileSP} from './subpages'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingPageLayoutProps = DivCommonProps & {}

export const ReadingPageLayout: FC<ReadingPageLayoutProps> = ({className, style, ...props}) => {
  const {setFileOId} = useReadingPageStatesContext()

  const stylePage: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    paddingLeft: '20px',
    width: '1700px'
  }

  // url 에서 fileOId 를 가져온다.
  useEffect(() => {
    const fileOId = window.location.pathname.split('reading/')[1]
    setFileOId(fileOId)
  }, [setFileOId])

  return (
    <div className={`READING_PAGE_LAYOUT ${className || ''}`} style={stylePage} {...props}>
      <MarginHeightBlock height="48px" />
      <EntireFileSP width="800px" />
    </div>
  )
}
