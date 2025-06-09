import {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'

import {SAKURA_BORDER} from '@value'

import {useReadingPageStatesContext} from '../_contexts/__states'

import type {CSSProperties, FC, RefObject} from 'react'
import type {Components} from 'react-markdown'
import type {DivCommonProps} from '@prop'

type FileContentsPartProps = DivCommonProps & {}

export const FileContentsPart: FC<FileContentsPartProps> = ({className, style, ...props}) => {
  const {file, isFileLoaded} = useReadingPageStatesContext()

  const [stringArr, setStringArr] = useState<string[]>([])

  const stylePart: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderRadius: '6px',
    borderWidth: '3px',

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

  const markDownComponent: Components = {
    code({node, className, children, ref, style, ...props}) {
      const inline = node?.position === undefined
      const match = /language-(\w+)/.exec(className || '')
      const _ref = ref as RefObject<SyntaxHighlighter> | null // eslint 때문에 이렇게 해줌

      if (!inline && match) {
        return (
          <SyntaxHighlighter
            customStyle={{...style, borderRadius: '0.5rem', padding: '1em'}}
            language={match[1]}
            PreTag="div"
            ref={_ref}
            {...props} // BLANK LINE COMMENT:
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      } // BLANK LINE COMMENT:
      else {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }
    }
  }

  // 마크다운에 넣어줄 문자열을 만들어줄 string[] 설정
  useEffect(() => {
    if (isFileLoaded) {
      setStringArr(file.contentsArr.map(content => content.value))
    }
  }, [file, isFileLoaded])

  return (
    <div className={`FILE_CONTENTS_PART ${className || ''}`} style={stylePart} {...props}>
      <ReactMarkdown
        components={markDownComponent}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        skipHtml={false} // BLANK LINE COMMENT:
      >
        {/* 1. 마크다운 적용할 "문자열" */}
        {stringArr.join('\n\n')}
      </ReactMarkdown>
    </div>
  )
}
