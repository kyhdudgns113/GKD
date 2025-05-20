import {FC, CSSProperties} from 'react'
import {DivCommonProps} from '../../../common'
import {useTablePageStatesContext} from '../_context'
import {useTablePageCallbacksContext} from '../_context/_callbacks'

type UserTableBodyObjectProps = DivCommonProps & {height?: string}
export const UserTableBodyObject: FC<UserTableBodyObjectProps> = ({
  className,
  height,
  ...props
}) => {
  const {seatIdx, pokerUsersArr, seatUserIdxsArr} = useTablePageStatesContext()
  const {selectUserToSeat} = useTablePageCallbacksContext()

  const borderRightWidth = '4px'

  const styleBody: CSSProperties = {
    borderColor: '#404844',
    borderBottomWidth: '4px',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: height || '300px',

    overflowY: 'scroll',
    width: 'fit-content'
  }
  const styleRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: '32px',
    width: 'fit-content'
  }
  const styleElem: CSSProperties = {
    alignContent: 'center',
    height: '32px',
    borderColor: '#404844',
    borderBottomWidth: '4px',
    fontSize: '15px',
    textAlign: 'center'
  }

  return (
    <div className={`USER_TABLE_BODY_OBJECT ${className || ''}`} style={styleBody} {...props}>
      <style>
        {`
          .USER_ROW {
            background-color: #FFFFFF;
          }
          .USER_ROW:hover {
            background-color: #D0D8D4;
          }
        `}
      </style>
      {pokerUsersArr.length === 0 && (
        <p style={{width: '284px', height: '50%', textAlign: 'center', alignContent: 'center'}}>
          유저 설정에서 로드하세요.
        </p>
      )}
      {pokerUsersArr.length > 0 &&
        pokerUsersArr.filter(
          (_, userIdx) => seatUserIdxsArr.findIndex(_userIdx => _userIdx === userIdx) === -1
        ).length === 0 && (
          <p style={{width: '284px', height: '50%', textAlign: 'center', alignContent: 'center'}}>
            남은 유저가 없어요
          </p>
        )}
      {pokerUsersArr.map((user, userIdx) => {
        const userSeatIdx = seatUserIdxsArr.findIndex(seatUseridx => seatUseridx === userIdx)

        if (userSeatIdx !== -1) return null

        return (
          <div
            className={`USER_ROW ${userIdx}`}
            key={userIdx}
            onClick={() => selectUserToSeat(userIdx, seatIdx)}
            style={styleRow} // BLANK LINE COMMENT:
          >
            <p style={{...styleElem, borderRightWidth, width: '156px'}}>{user.name}</p>
            <p style={{...styleElem, borderRightWidth, width: '64px'}}>
              {user.bankroll + (user.chips || 0)}
            </p>
            <p style={{...styleElem, borderRightWidth, width: '64px'}}>{user.debts}</p>
          </div>
        )
      })}
    </div>
  )
}
