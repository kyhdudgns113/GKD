import {useEffect} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'node_modules/remark-breaks/lib'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {useDirectoryCallbacksContext, useFileCallbacksContext, useFileStatesContext} from '@context'
import {CheckAuth} from '@guard'
import {AUTH_GUEST} from '@secret'

import './_styles/MainPage.scss'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import {markDownComponent} from '@commons/typesAndValues'

type MainPageProps = DivCommonProps & {reqAuth?: number}

export const MainPage: FC<MainPageProps> = ({reqAuth, className, style, ...props}) => {
  const {loadRootDirectory} = useDirectoryCallbacksContext()
  const {stringArr} = useFileStatesContext()
  const {loadNoticeFile} = useFileCallbacksContext()

  const stylePage: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%'
  }

  // 메인 페이지로 올 때마다 루트 디렉토리를 불러온다
  useEffect(() => {
    loadRootDirectory()
    loadNoticeFile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CheckAuth reqAuth={reqAuth || AUTH_GUEST}>
      <div className={`MainPage ${className || ''}`} style={stylePage} {...props}>
        <div className="_pageWrapper">
          <div className="MarkdownArea">
            <ReactMarkdown
              components={markDownComponent(stringArr)}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              skipHtml={false} // ::
            >
              {/* 1. 마크다운 적용할 "문자열" */}
              {stringArr.join('\n')}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </CheckAuth>
  )
}
