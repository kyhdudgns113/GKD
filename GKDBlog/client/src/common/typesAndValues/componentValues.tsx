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

      let headerRemoved = ''

      let marker = '•'
      let fontSize = '16px'
      let isOrdered = false
      let markerSize = '16px'
      let marginTop: string | number = 0

      const marginRight = '8px'
      const alignItems = 'center'

      // 리스트 앞에 붙은 기호에 따라 폰트 크기와 마진 탑을 조정한다.
      if (trimmed.startsWith('+')) {
        markerSize = '8px'
        marker = '■'
        marginTop = 8
        headerRemoved = trimmed.replace(/^\+ /, '')
      } // ::
      else if (trimmed.startsWith('*')) {
        markerSize = '8px'
        marker = '◯'
        marginTop = 8

        headerRemoved = trimmed.replace(/^\* /, '')
      } // ::
      else if (/^\d+\./.test(trimmed)) {
        // ol 의 자식으로 렌더링되는 경우이다.
        isOrdered = true
        headerRemoved = trimmed.replace(/^\d+\. /, '')
      } // ::
      else if (trimmed.startsWith('-')) {
        marker = '•'
        headerRemoved = trimmed.replace(/^\- /, '')
      }

      // 리스트 뒤에 붙은 h 숫자에 따라 폰트 크기와 마진 탑을 조정한다.
      if (headerRemoved.startsWith('######')) {
        fontSize = '12px'
        marginTop += -2
      } // ::
      else if (headerRemoved.startsWith('#####')) {
        fontSize = '14px'
        marginTop += -1
      } // ::
      else if (headerRemoved.startsWith('####')) {
        fontSize = '16px'
      } // ::
      else if (headerRemoved.startsWith('###')) {
        fontSize = '18px'
        marginTop += 1
      } // ::
      else if (headerRemoved.startsWith('##')) {
        fontSize = '24px'
        marginTop += 6
      } // ::
      else if (headerRemoved.startsWith('#')) {
        fontSize = '32px'
        marginTop += 12
      }

      // marginTop 을 string 화 한다.
      marginTop = marginTop.toString() + 'px'

      if (isOrdered) {
        // ol 의 자식인 경우다.
        return (
          <li {...props} style={{fontSize, marginLeft: '1rem'}}>
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
          {marker && (
            <span style={{alignItems, fontSize: markerSize, marginRight, marginTop, textAlign: 'center', userSelect: 'none'}}>{marker}</span>
          )}
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
