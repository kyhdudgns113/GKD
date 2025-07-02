import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

import type {RefObject} from 'react'
import type {Components} from 'react-markdown'

/* eslint-disable */
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

      let marker = '•'
      let isOrdered = false

      if (trimmed.startsWith('+')) marker = '■'
      else if (trimmed.startsWith('*')) marker = '◯'
      else if (/^\d+\./.test(trimmed)) {
        // ol 의 자식으로 렌더링되는 경우이다.
        isOrdered = true
      }

      if (isOrdered) {
        // ol 의 자식인 경우다.
        return (
          <li {...props} style={{marginLeft: '1rem'}}>
            {children}
          </li>
        )
      } // ::

      return (
        <li
          {...props}
          style={{
            alignItems: 'flex-start',
            display: 'flex'
          }}
        >
          {marker && <span style={{marginRight: '0.5em', userSelect: 'none'}}>{marker}</span>}
          <div>{children}</div>
        </li>
      )
    },

    ol({children, ...props}) {
      return (
        <ol
          {...props}
          style={{
            listStyleType: 'decimal',
            paddingLeft: '0.5rem'
          }}
        >
          {children}
        </ol>
      )
    },

    ul({children, ...props}) {
      return (
        <ul
          {...props}
          style={{
            listStyleType: 'none',
            paddingLeft: '0.5rem'
          }}
        >
          {children}
        </ul>
      )
    }
  }
  return ret
}
