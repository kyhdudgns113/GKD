import {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import {useFileStatesContext} from '@context'
import {markDownComponent} from '@commons/typesAndValues'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import remarkBreaks from 'node_modules/remark-breaks/lib'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

type ReadingContentPartProps = DivCommonProps

export const ReadingContentPart: FC<ReadingContentPartProps> = ({className, style, ...props}) => {
  const {file} = useFileStatesContext()

  const [stringArr, setStringArr] = useState<string[]>([])

  useEffect(() => {
    setStringArr(
      file.content?.split('\n').map(str => {
        if (!str) {
          return ''
        } // ::
        else if (str === '  ') {
          return '<br />'
        }
        return str
      })
    )
  }, [file])

  return (
    <div className={`ReadingContent_Part ${className || ''}`} style={style} {...props}>
      <ReactMarkdown
        components={markDownComponent(stringArr)}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        skipHtml={false} // ::
      >
        {/* 1. 마크다운 적용할 "문자열" */}
        {stringArr.join('\n\n')}
      </ReactMarkdown>

      <div className="_bottomLine" />
    </div>
  )
}
