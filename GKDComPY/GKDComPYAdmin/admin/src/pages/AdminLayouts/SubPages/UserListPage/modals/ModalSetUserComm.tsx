import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {useUserListContext} from '../UserListPage'
import {Modal, Text3XL, Text5XL} from '../../../../../common/components'
import {CommsRowType, UserInfoAuthType} from '../../../../../common/shareTypes'
import {getWithJwt} from '../../../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../../../common/utils'

type ModalSetUserCommProps = DivCommonProps & {
  //
}
export const ModalSetUserComm: FC<ModalSetUserCommProps> = ({className, ...props}) => {
  const {
    isModalSetComm: uOId,
    users,
    setIsModalSetComm,
    setUserCommAuthority
  } = useUserListContext()

  const [commsRowsArr, setCommsRowsArr] = useState<CommsRowType[]>([])
  const [user, setUser] = useState<UserInfoAuthType>({
    uOId: '',
    id: '',
    commOId: '',
    authVal: 0,
    unreadMessages: {}
  })

  const cnRow = 'select-none hover:bg-gkd-sakura-bg border-gkd-sakura-border'

  const styleBlock: CSSProperties = {
    width: '500px',
    maxHeight: '800px',
    height: 'auto',
    paddingBottom: '16px'
  }
  const styleRow: CSSProperties = {
    width: '18rem',
    borderRadius: '0.5rem',
    borderWidth: '4px',
    cursor: 'pointer',

    marginTop: '16px',
    paddingTop: '2px',
    paddingBottom: '2px',

    textAlign: 'center'
  }

  // AREA2: Function
  const onClickRow = useCallback(
    (commsRow: CommsRowType) => (e: MouseEvent<HTMLParagraphElement>) => {
      setUserCommAuthority(uOId, commsRow.commOId, 1)
      setIsModalSetComm('')
    },
    [uOId, setIsModalSetComm, setUserCommAuthority]
  )

  // useEffect AREA:
  // Set user
  useEffect(() => {
    if (uOId) {
      setUser(users[uOId])
    } // BLANK LINE COMMENT:
    else {
      setUser({uOId: '', id: '', commOId: '', authVal: 0, unreadMessages: {}})
    }
  }, [uOId, users])
  // Set commsRows
  useEffect(() => {
    if (uOId) {
      getWithJwt(`/admin/userList/getCommsRows`)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setCommsRowsArr(body.commsRowsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/userList/getCommsRows CATCH`, errObj)
          }
        })
        .catch(errObj => alertErrors(`/admin/userList/getCommsRows CATCH`, errObj))
    }
  }, [uOId])

  // TSX AREA:
  return (
    <Modal
      className={`overflow-y-auto ${className}`}
      onClose={() => setIsModalSetComm('')}
      style={styleBlock}
      {...props}>
      <Text5XL className="mt-4 select-none mb-4">{user.id}</Text5XL>
      {commsRowsArr.length > 0 &&
        commsRowsArr.map((commsRow, commIdx) => {
          return (
            <Text3XL
              className={` ${cnRow}`}
              key={`commRowIdx:${commIdx}`}
              onClick={onClickRow(commsRow)}
              style={styleRow}>
              {commsRow.name}
            </Text3XL>
          )
        })}
    </Modal>
  )
}
