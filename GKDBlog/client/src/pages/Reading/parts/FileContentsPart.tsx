import {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import {SAKURA_BG_50, SAKURA_BORDER} from '@value'
import {markDownComponent} from '@common'

import {useReadingPageStatesContext} from '../_contexts/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import remarkBreaks from 'remark-breaks'

type FileContentsPartProps = DivCommonProps & {}

export const FileContentsPart: FC<FileContentsPartProps> = ({className, style, ...props}) => {
  const {file, isFileLoaded} = useReadingPageStatesContext()

  const [stringArr, setStringArr] = useState<string[]>([])

  const stylePart: CSSProperties = {
    ...style,

    backgroundColor: SAKURA_BG_50 + '88',

    borderColor: SAKURA_BORDER,
    borderRadius: '4px',
    borderWidth: '1px',

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    minHeight: '500px',

    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',

    width: '100%'
  }

  // 마크다운에 넣어줄 문자열을 만들어줄 string[] 설정
  useEffect(() => {
    if (isFileLoaded) {
      setStringArr(
        file.contentsArr.map(content => {
          if (content.value === '  ') return '  <br />'
          return content.value
        })
      )
    }
  }, [file, isFileLoaded])

  return (
    <div className={`FILE_CONTENTS_PART ${className || ''}`} style={stylePart} {...props}>
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
