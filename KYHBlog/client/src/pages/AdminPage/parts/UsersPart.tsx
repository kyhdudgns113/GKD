import {useCallback} from 'react'
import {useAdminCallbacksContext, useAdminStatesContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type UsersPartProps = DivCommonProps & {}

export const UsersPart: FC<UsersPartProps> = ({className, style, ...props}) => {
  const {isLoadingUserArr, userArr} = useAdminStatesContext()
  const {loadUserArr} = useAdminCallbacksContext()

  const onClickTitle = useCallback(() => {
    if (isLoadingUserArr.current) {
      alert('아직 로딩중입니다.')
      return
    }
    isLoadingUserArr.current = true
    loadUserArr(true) // ::
      .then(ok => {
        if (ok) {
          isLoadingUserArr.current = false
        } // ::
        else {
          // It will do something
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`UsersPart _admin_part ${className || ''}`} style={style} {...props}>
      {/* 1. 타이틀 */}
      <p className="_part_title" onClick={onClickTitle}>
        Users
      </p>

      {isLoadingUserArr.current && <p>Loading...</p>}

      {/* 2. 전체 유저수 */}
      <p className="_part_content">전체 유저수: {userArr.length}</p>
    </div>
  )
}
