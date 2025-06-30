import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

import type {RefObject} from 'react'
import type {Components} from 'react-markdown'

export const markDownComponent = (stringArr: string[]) => {
  const ret: Components = {
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
            {...props} // ::
          >
            {String(children)}
          </SyntaxHighlighter>
        )
      } // ::
      else {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }
    },

    li({children, node, ...props}) {
      const line = node?.position?.start?.line
      const raw = line ? stringArr[line - 1] : ''
      const trimmed = raw?.trimStart() || ''

      let markerStyle = '–' // 기본: 대시

      if (trimmed.startsWith('+')) markerStyle = '+'
      else if (trimmed.startsWith('*')) markerStyle = '•'

      return (
        <li {...props} style={{display: 'flex', alignItems: 'flex-start', listStyleType: 'none'}}>
          <span style={{marginRight: '0.5em'}}>{markerStyle}</span>
          <div style={{display: 'inline'}}>{children}</div>
        </li>
      )
    }
  }
  return ret
}
