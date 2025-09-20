import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'node_modules/remark-breaks/lib'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import {useCallback, useEffect, useRef} from 'react'
import {useFileStatesContext} from '@context'
import {markDownComponent} from '@commons/typesAndValues'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingContentPartProps = DivCommonProps

export const ReadingContentPart: FC<ReadingContentPartProps> = ({className, style, ...props}) => {
  const {stringArr} = useFileStatesContext()

  const containerRef = useRef<HTMLDivElement>(null)

  const onClickStatus = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const parent = target.parentElement

    if (!parent) return

    const childrens = parent.children

    Array.from(childrens).forEach(children => {
      const child = children as HTMLElement
      child.hidden = false
    })

    target.hidden = true
  }, [])

  const onDoubleClick = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const childrens = target.children

    let isHidden = false
    let isStatusExist = false

    Array.from(childrens).forEach((children, idx) => {
      if (idx > 0) {
        const child = children as HTMLElement

        child.hidden = !child.hidden
        if (!child.className.includes('_blockStatus')) {
          isHidden = child.hidden
        } // ::
        else {
          isStatusExist = true
        }
      }
    })

    if (isHidden && !isStatusExist) {
      const span = document.createElement('span')
      span.className = '_blockStatus material-symbols-outlined align-middle select-none '
      span.textContent = 'more_horiz'
      span.addEventListener('click', onClickStatus)
      target.appendChild(span)
    }

    // 이거 해줘야 펼쳐진 상태로 될 때 selection 이 안된다.
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 이벤트 리스너: div.block_ 에 더블클릭 이벤트 부착
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const blocks = container.querySelectorAll('[class*="block_"]')
    blocks.forEach(block => {
      block.addEventListener('dblclick', onDoubleClick)
    })

    return () => {
      blocks.forEach(block => {
        block.removeEventListener('dblclick', onDoubleClick)
      })
    }
  }, [stringArr]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`ReadingContent_Part ${className || ''}`} style={style} {...props}>
      <div className="MarkdownArea" key={stringArr[0] || 'keys'} ref={containerRef}>
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
