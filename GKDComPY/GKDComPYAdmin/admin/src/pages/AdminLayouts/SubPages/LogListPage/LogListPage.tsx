import {createContext, CSSProperties, FC, useContext, useEffect, useState} from 'react'
import {DivCommonProps, SAKURA_BORDER, SAKURA_TEXT, Setter} from '../../../../common'
import {LogType, UserInfoAuthType} from '../../../../common/shareTypes'
import {useAdminContext} from '../../AdminLayout'
import {getWithJwt} from '../../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../../common/utils'
import {LogTableBody, LogTableHead} from './parts'

// prettier-ignore
type ContextType = {
  logsArr: LogType[], setLogsArr: Setter<LogType[]>,
  users: {[uOId: string]: UserInfoAuthType}, setUsers: Setter<{[uOId: string]: UserInfoAuthType}>,
}
// prettier-ignore
export const LogContext = createContext<ContextType>({
  logsArr: [], setLogsArr: () => {},
  users: {}, setUsers: () => {}
})

export const useLogContext = () => {
  return useContext(LogContext)
}

type LogListPageProps = DivCommonProps & {}
export const LogListPage: FC<LogListPageProps> = ({className, ...props}) => {
  const {setWhichList} = useAdminContext()
  /* eslint-disable */
  const [logsArr, setLogsArr] = useState<LogType[]>([])
  const [users, setUsers] = useState<{[uOId: string]: UserInfoAuthType}>({})
  /* eslint-enable */

  const styleTable: CSSProperties = {
    borderCollapse: 'collapse',
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',

    color: SAKURA_TEXT,
    // 여기서 text 중앙정렬 하면 안된다.
    // 로그 내용은 왼쪽에 붙여야 한다.
    marginTop: '32px',
    marginLeft: '32px',
    userSelect: 'none'
  }

  // Set current page log
  useEffect(() => {
    setWhichList('log')
  }, [setWhichList])
  // Load logsArr from DB
  useEffect(() => {
    if (logsArr.length === 0) {
      const url = `/admin/logList/getLogsArr`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setLogsArr(body.logsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    }
  }, [logsArr])
  // Load users from DB
  useEffect(() => {
    if (!users) {
      const url = `/admin/logList/getUsers`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setUsers(body.users)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ` CATCH`, errObj))
    }
  }, [users])

  // prettier-ignore
  const value = {
    logsArr, setLogsArr,
    users, setUsers
  }

  return (
    <LogContext.Provider value={value}>
      <div className={`${className}`} {...props}>
        <table style={styleTable}>
          <LogTableHead />
          <LogTableBody />
        </table>
      </div>
    </LogContext.Provider>
  )
}
