import {useEffect, useState} from 'react'

import {markDownComponent} from '@common'

import {useDefaultPageStatesContext} from '../contexts/__states'

import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'

type IntroPostSPProps = DivCommonProps & {}

export const IntroPostSP: FC<IntroPostSPProps> = ({className, style, ...props}) => {
  const {file} = useDefaultPageStatesContext()
  const [stringArr, setStringArr] = useState<string[]>([])

  const styleSP: CSSProperties = {
    ...style,

    backgroundColor: '#F0F4F0',

    borderRadius: '16px',
    boxShadow: 'inset 0 0 6px 0 rgba(0, 0, 0, 0.3)',

    height: 'fit-content',

    minHeight: '600px',

    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',

    width: '50%'
  }

  // 마크다운에 넣어줄 문자열을 만들어줄 string[] 설정
  useEffect(() => {
    setStringArr(
      file.contentsArr.map(content => {
        if (content.value === '  ') return '  <br />'
        return content.value
      })
    )
  }, [file])

  return (
    <div className={`INTRO_POST_SP ${className || ''}`} style={styleSP} {...props}>
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
  )
}
