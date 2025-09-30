import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useFileStatesContext} from '@context'
import {CheckAuth} from '@guard'
import {ReadingHeaderPart, ReadingContentPart, ReadingCommentsPart} from './parts'

import './_styles/ReadingPage.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingPageProps = DivCommonProps & {reqAuth?: number}

export const ReadingPage: FC<ReadingPageProps> = ({reqAuth, className, style, ...props}) => {
  const {setFileOId} = useFileStatesContext()

  const location = useLocation()

  // 초기화: fileOId
  useEffect(() => {
    const isFileOId = location.pathname.match(/\/reading\/(.+)/)
    if (isFileOId) {
      setFileOId(isFileOId[1])
    } // ::
    else {
      setFileOId('')
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`ReadingPage ${className || ''}`} style={style} {...props}>
        <div className="_pageWrapper">
          <ReadingHeaderPart />
          <ReadingContentPart />
          <ReadingCommentsPart />
        </div>
      </div>
    </CheckAuth>
  )
}
