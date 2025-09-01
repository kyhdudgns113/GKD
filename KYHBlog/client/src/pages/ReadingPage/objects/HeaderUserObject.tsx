import {useCallback} from 'react'
import {useFileCallbacksContext, useFileStatesContext} from '@context'
import {HeaderUserModalGroup} from '../groups'

import '../_styles/ReadingPage.scss'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import {Icon} from '@commons/components'

type HeaderUserObjectProps = DivCommonProps

export const HeaderUserObject: FC<HeaderUserObjectProps> = ({className, style, ...props}) => {
  const {file, isFileUserSelected} = useFileStatesContext()
  const {selectFileUser} = useFileCallbacksContext()

  const onClickUserName = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()

    selectFileUser()

    window.getSelection()?.removeAllRanges()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseDownUserName = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div className={`HeaderUser_Object ${className || ''}`} style={style} {...props}>
      <Icon className="_icon" iconName="account_circle" />

      <div className="_fileWrapper">
        <p className="_userName" onClick={onClickUserName} onMouseDown={onMouseDownUserName}>
          {file.userName}
        </p>
        <p className="_createdAt">{new Date(file.createdAt).toLocaleDateString('ko-KR')}</p>

        {isFileUserSelected && <HeaderUserModalGroup />}
      </div>
    </div>
  )
}
