import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {Icon, IconFilled} from '../../../common/components'
import {useMainPageStatesContext} from '../_contexts'
import {UserInfoAuthType} from '../../../common/typesAndValues/shareTypes'
import {DivCommonProps, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {useAuthContext} from '../../../contexts'
import {useTemplateStatesContext} from '../../../template/_contexts'

type UsersPartProps = DivCommonProps & {}
export const UsersPart: FC<UsersPartProps> = ({className, ...props}) => {
  const {uOId} = useAuthContext()
  const {comm, usersArr} = useTemplateStatesContext()
  const {setIsAddUserModal, setIsModifySelfModal, setIsModifyUserModal} = useMainPageStatesContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleDiv: CSSProperties = {
    ...props.style,
    borderColor: SAKURA_BORDER,
    borderWidth: '6px',
    borderRadius: '12px',
    display: 'flex',

    height: 'fit-content',
    width: '180px'
  }
  const styleIcon: CSSProperties = {
    cursor: 'pointer',
    fontSize: '1.75rem',
    lineHeight: '2rem',
    userSelect: 'none'
  }
  const styleOutBtnDiv: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderTopWidth: '2px',
    display: 'flex',
    justifyContent: 'center',
    padding: '4px',
    width: '100%'
  }
  const styleUID: CSSProperties = {
    alignItems: 'center',
    borderColor: SAKURA_BORDER,
    borderTopWidth: '2px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    height: '1.875rem',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    userSelect: 'none'
  }
  const styleUIDP: CSSProperties = {
    color: SAKURA_TEXT,
    fontSize: '1rem',
    fontWeight: 800,
    lineHeight: '1.5rem'
  }
  const styleTitle: CSSProperties = {
    borderBottomWidth: '2px',
    borderColor: SAKURA_BORDER,
    color: SAKURA_TEXT,
    fontSize: '1.5rem',
    fontWeight: 800,
    lineHeight: '2rem',
    paddingBottom: '8px',
    paddingTop: '8px',

    textAlign: 'center',
    userSelect: 'none'
  }

  const mouseHover = useCallback(
    (hoverVal: boolean) => (e: MouseEvent<HTMLDivElement>) => {
      setIsHover(hoverVal)
    },
    []
  )
  const onClickAddUser = useCallback(
    (uOId: string, commOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      /* 이제 최대 유저수 확인은 서버에서 한다 */
      // if (usersArr.length > 3) {
      //   talkToGKD()
      //   return
      // }
      if (comm.users[uOId] !== 2) {
        alert('권한이 없습니다.')
        return
      }
      setIsAddUserModal(commOId)
    },
    [comm, setIsAddUserModal]
  )
  const onClickUserRow = useCallback(
    (user: UserInfoAuthType) => (e: MouseEvent<HTMLDivElement>) => {
      if (comm.users[uOId] < 2 && user.uOId !== uOId) {
        alert(`${user.id}님은 운영을 위해 힘써주시는 분입니다`)
        return
      }
      if (user.uOId !== uOId) {
        setIsModifyUserModal(user.uOId)
      } // BLANK LINE COMMENT:
      else {
        setIsModifySelfModal(user.uOId)
      }
    },
    [comm, uOId, setIsModifySelfModal, setIsModifyUserModal]
  )

  return (
    <div className={`flex-col ${className}`} style={styleDiv} {...props}>
      {/* 타이틀 */}
      <p style={styleTitle}>운영진 목록</p>

      {/* 유저 목록 */}
      {usersArr.map((user, userIdx) => {
        return (
          <div
            className="hover:bg-gkd-sakura-bg"
            key={`uRow:${userIdx}`}
            onClick={onClickUserRow(user)}
            style={styleUID} // BLANK LINE COMMENT:
          >
            <p style={styleUIDP}>{user.id}</p>
          </div>
        )
      })}

      {/* 유저 추가 버튼 */}
      {comm.users[uOId] === 2 && (
        <div className="flex-row" style={styleOutBtnDiv}>
          <div
            className="w-fit h-fit"
            onClick={onClickAddUser(uOId, comm.commOId)}
            onMouseEnter={mouseHover(true)}
            onMouseLeave={mouseHover(false)} // BLANK LINE COMMENT:
          >
            {isHover ? (
              <IconFilled iconName="add_box" style={styleIcon} />
            ) : (
              <Icon iconName="add_box" style={styleIcon} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
