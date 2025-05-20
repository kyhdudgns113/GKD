import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {UserInfoAuthType} from '../../../../../common/shareTypes'
import {useUserListContext} from '../UserListPage'
import {Icon} from '../../../../../common/components'
import {getWithJwt} from '../../../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../../../common/utils'

type UserInfoChartProps = DivCommonProps & {
  //
}
export const UserInfoChart: FC<UserInfoChartProps> = ({className, ...props}) => {
  const {users, setIsModalSetComm, setUserCommAuthority} = useUserListContext()

  /**
   * UserInfoAuthType 에 넣을까 엄청 고민하다가 결국 넣지 않기로 했다.\
   * AuthType 을 Admin 에서만 쓰는게 아니다 \
   * http 요청할때 authVal 섞어서 넣으면 보안에 문제 생길 수 있기에 포함하지 않는다
   */
  const [authValsArr, setAuthValsArr] = useState<(number | null)[]>([])
  const [commNames, setCommNames] = useState<{[commOId: string]: string}>({})
  const [usersArr, setUsersArr] = useState<UserInfoAuthType[]>([])

  // AREA1: Constant
  const cnTH =
    'border-gkd-sakura-border border-2 text-gkd-sakura-text font-bold select-none text-center '

  const styleTable: CSSProperties = {
    borderCollapse: 'collapse',
    borderWidth: '5px'
  }
  const styleID: CSSProperties = {
    width: '10rem'
  }
  const styleAdmin: CSSProperties = {
    width: '3rem'
  }
  const styleComm: CSSProperties = {
    width: '10rem'
  }

  // AREA2: Event function
  const onClickSetAdmin = useCallback(
    (user: UserInfoAuthType, userIdx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      const prevVal = authValsArr[userIdx]
      const newAdminVal = prevVal ? null : 1
      setUserCommAuthority(user.uOId, 'admin', newAdminVal)
    },
    [authValsArr, setUserCommAuthority]
  )
  const onClickSetComm = useCallback(
    (user: UserInfoAuthType) => (e: MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation()
      if (user.id === 'GKD_Master') {
        alert(`그는 이미 전능한듯 해요...`)
        return
      }
      setIsModalSetComm(user.uOId)
    },
    [setIsModalSetComm]
  )

  // useEffect AREA:
  // Set and Sort usersArr
  useEffect(() => {
    const newArr = Object.keys(users).map(key => users[key])
    newArr.sort((user1, user2) => {
      if (user1.id === 'GKD_Master') {
        return -1
      }
      if (user2.id === 'GKD_Master') {
        return 1
      }
      return user1.id.localeCompare(user2.id)
    })
    setUsersArr(newArr)

    return () => {
      setUsersArr([])
    }
  }, [users])
  // Get authValsArr
  useEffect(() => {
    if (usersArr.length > 0 && Object.keys(users).length > 0) {
      const uOIdsArr = usersArr.map(user => user.uOId)
      const newAuthValsArr = Array(uOIdsArr.length).fill(0)
      Promise.all(
        uOIdsArr.map(async (uOId, userIdx) => {
          const commOId = users[uOId].commOId
          await getWithJwt(`/admin/userList/getAuthval/${commOId}/${uOId}`)
            .then(res => res.json())
            .then(res => {
              const {ok, body, errObj, jwtFromServer} = res
              if (ok) {
                newAuthValsArr[userIdx] = body.authVal
                writeJwtFromServer(jwtFromServer)
              } // BLANK LINE COMMENT:
              else {
                alertErrors(`/admin/userList/getAuthval ELSE`, errObj)
              }
            })
            .catch(errObj => alertErrors(`/admin/userList/getAuthval ELSE`, errObj))
          return null
        })
      ).then(() => {
        setAuthValsArr(newAuthValsArr)
      })
    }
  }, [users, usersArr])

  // Get comms name
  useEffect(() => {
    /**
     * 중복되지 않는 commOId 의 배열마다 이름을 불러온다 \
     * - 따라서 authValsArr 와 코드를 분리한다. \
     * 또한, Admin 페이지에서 GKD_Master 회원가입을 하는 경우를 고려한다. \
     * - 따라서 default comm 이름을 '관리자' 로 한다 \
     * - 이름만 관리자이고 실제 관리자 권한은 없다
     */
    if (usersArr.length > 0) {
      // 중복된 commOId 를 뺀다.
      const commOIdArr = Array.from(new Set(usersArr.map(user => user.commOId)))
      commOIdArr.forEach(commOId => {
        getWithJwt(`/admin/userList/getCommName/${commOId}`)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setCommNames(prev => {
                const newPrev = {...prev}
                newPrev[commOId] = body.commName
                return newPrev
              })
              writeJwtFromServer(jwtFromServer)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`/admin/userList/getCommName/${commOId}`, errObj)
            }
          })
          .catch(errObj => alertErrors(`/admin/userList/getCommName/${commOId}`, errObj))
      })
    }
  }, [usersArr])

  // TSX AREA:
  return (
    <div className={`flex flex-col w-fit ${className}`} {...props}>
      <table className="border-gkd-sakura-border w-fit" style={styleTable}>
        <thead>
          <tr>
            <th className={`text-2xl ${cnTH}`} style={styleID}>
              이름
            </th>
            <th className={`text-2xl ${cnTH}`} style={styleAdmin}>
              <Icon iconName="admin_panel_settings" />
            </th>
            <th className={`text-2xl ${cnTH}`}>소속 공동체</th>
          </tr>
        </thead>
        <tbody>
          {usersArr.map((user, userIdx) => {
            const commName = commNames[user.commOId] || '관리자?'
            const authVal = authValsArr[userIdx]
            return (
              <tr key={`userInfo:${userIdx}`}>
                <td className={`pl-2 ${cnTH}`} style={styleID}>
                  {user.id}
                </td>
                <td
                  className={`cursor-pointer ${cnTH}`}
                  onClick={onClickSetAdmin(user, userIdx)}
                  style={styleAdmin} //
                >
                  {authVal ? 'YES' : 'NO'}
                </td>
                <td
                  className={`hover:bg-gkd-sakura-bg cursor-pointer ${cnTH}`}
                  onClick={onClickSetComm(user)}
                  style={styleComm} //
                >
                  {commName || '이름없는공동체'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
