import {useCallback} from 'react'
import {useAdminCallbacksContext, useAdminStatesContext} from '@context'
import './AdminLogsPage.scss'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as P from './parts'

type AdminLogsPageProps = DivCommonProps

// prettier-ignore
export const AdminLogsPage: FC<AdminLogsPageProps> = ({className, style, ...props}) => {
  const {isLoadingLogArr} = useAdminStatesContext()
  const {setIsLoadingLogArr} = useAdminStatesContext()
  const {closeLogGKDError, closeLogGKDStatus, loadLogArr} = useAdminCallbacksContext()

  const onClickPage = useCallback(() => {
    closeLogGKDError()
    closeLogGKDStatus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickTitle = useCallback((isLoading: boolean | null) => (e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()

    if (isLoading) {
      alert('아직 로딩중입니다.')
      return
    }

    setIsLoadingLogArr(true)
    loadLogArr(true)
      .then(ok => {
        if (ok) {
          setIsLoadingLogArr(false)
        } // ::
        else {
          setIsLoadingLogArr(null)
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`AdminLogs_Page ${className || ''}`} onClick={onClickPage} style={style} {...props}>
      <div className="_pageWrapper">
        {/* 1. 타이틀 */}
        <p className="_page_title" onClick={onClickTitle(isLoadingLogArr)}>로그 관리 페이지</p>

        {/* 2. 로그 목록 테이블 */}
        <P.LogTablePart />
      </div>
    </div>
  )
}
