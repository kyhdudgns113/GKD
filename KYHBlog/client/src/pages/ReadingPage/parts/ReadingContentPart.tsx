import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'node_modules/remark-breaks/lib'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {useFileStatesContext} from '@context'
import {markDownComponent} from '@commons/typesAndValues'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingContentPartProps = DivCommonProps

export const ReadingContentPart: FC<ReadingContentPartProps> = ({className, style, ...props}) => {
  const {stringArr} = useFileStatesContext()

  return (
    <div className={`ReadingContent_Part ${className || ''}`} style={style} {...props}>
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

      <div className="_bottomLine" />
    </div>
  )
}
