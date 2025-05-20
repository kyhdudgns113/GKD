import {CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {useTablePageCallbacksContext, useTablePageStatesContext} from '../_context'

type UserNameAndExitObjectProps = DivCommonProps & {height?: string}
export const UserNameAndExitObject: FC<UserNameAndExitObjectProps> = ({
  className,
  height,
  ...props
}) => {
  const {rebuy, seatIdx, pokerUsersArr, seatUserIdxsArr} = useTablePageStatesContext()
  const {chipIncFromBankroll, selectSeatUserLeave} = useTablePageCallbacksContext()

  const [userBankroll, setUserBankroll] = useState<string>('')
  const [userChips, setUserChips] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  const styleRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '60px',
    paddingTop: '2px',
    paddingBottom: '2px',
    width: 'fit-content'
  }
  const styleTitle: CSSProperties = {
    alignContent: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    height: '40px',
    textAlign: 'center'
  }
  const styleButton: CSSProperties = {
    alignContent: 'center',
    borderColor: '#404844',
    borderRadius: '8px',
    borderWidth: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    height: '40px',

    marginLeft: '16px',
    textAlign: 'center',
    width: '60px'
  }

  const onClickAddChip = useCallback(
    (seatIdx: number) => () => {
      chipIncFromBankroll(seatIdx, rebuy)
    },
    [rebuy, chipIncFromBankroll]
  )

  // Set userName
  useEffect(() => {
    const userIdx = seatUserIdxsArr[seatIdx]
    if (userIdx !== -1) {
      setUserName(pokerUsersArr[userIdx].name)
      setUserChips((pokerUsersArr[userIdx].chips || 0).toLocaleString())
      setUserBankroll((pokerUsersArr[userIdx].bankroll || 0).toLocaleString())
    } // BLANK LINE COMMENT:
    else {
      setUserName('')
      setUserChips('0')
      setUserBankroll('0')
    }
  }, [seatUserIdxsArr, seatIdx, pokerUsersArr])

  return (
    <div className={`USER_NAME_AND_EXIT_OBJECT ${className || ''}`} style={styleRow} {...props}>
      <style>
        {`
          button {
            background-color: #A0A8A4;
          }
          button:hover {
            background-color: #C0C8C4;
          }
        `}
      </style>
      <p style={styleTitle}>
        {seatIdx}번 좌석 유저: {userName || '--'}, {userChips}/{userBankroll}
      </p>
      {seatIdx !== -1 && seatUserIdxsArr[seatIdx] !== -1 && (
        <button onClick={selectSeatUserLeave(seatIdx)} style={styleButton}>
          공석
        </button>
      )}
      {seatIdx !== -1 && seatUserIdxsArr[seatIdx] !== -1 && (
        <button onClick={onClickAddChip(seatIdx)} style={styleButton}>
          추가
        </button>
      )}
    </div>
  )
}
