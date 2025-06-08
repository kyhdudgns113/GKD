import {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

import {useReadingPageStatesContext} from '../_contexts/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type FileContentsPartProps = DivCommonProps & {}

/* eslint-disable */
export const FileContentsPart: FC<FileContentsPartProps> = ({className, style, ...props}) => {
  const {file, isFileLoaded} = useReadingPageStatesContext()
  const [stringArr, setStringArr] = useState<string[]>([])

  const stylePart: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: '100%'
  }

  useEffect(() => {
    if (isFileLoaded) {
      setStringArr(file.contentsArr.map(content => content.value))
    }
  }, [file, isFileLoaded])

  return (
    <div className={`FILE_CONTENTS_PART ${className || ''}`} style={stylePart} {...props}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, className, children, ...props}) {
            const inline = node?.position === undefined
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                PreTag="div"
                customStyle={{borderRadius: '0.5rem', padding: '1em'}}
                {...props} // BLANK LINE COMMENT:
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }} // BLANK LINE COMMENT:
      >
        {/* 1. 마크다운 적용할 "문자열" */}
        {stringArr.join('\n\n')}
      </ReactMarkdown>
    </div>
  )
}
/* eslint-enable */
