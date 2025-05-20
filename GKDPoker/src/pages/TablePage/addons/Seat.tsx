import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps, STATE_INIT, USER_FOLD} from '../../../common'
import {useTablePageStatesContext} from '../_context'

type SeatProps = DivCommonProps & {
  hereSeatIdx: number
  isBottom?: string
  isLeft?: string
  isRight?: string
  isTop?: string
}
export const Seat: FC<SeatProps> = ({
  hereSeatIdx,
  isBottom,
  isLeft,
  isRight,
  isTop,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {dealerSeatIdx, gameState, pokerUsersArr, seatIdx, seatUserIdxsArr, setSeatIdx} =
    useTablePageStatesContext()

  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF')
  const [userName, setUserName] = useState<string>('')
  const [userChips, setUserChips] = useState<string>('')

  const styleSeat: CSSProperties = {
    alignItems: 'center',
    backgroundColor,
    borderColor: '#000000',
    borderBottomWidth: isBottom || '0px',
    borderLeftWidth: isLeft || '0px',
    borderRightWidth: isRight || '0px',
    borderTopWidth: isTop || '0px',
    display: 'flex',
    flexDirection: 'column',
    height: '80px',

    width: '80px'
  }
  const styleName: CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center'
  }
  const styleChips: CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center'
  }
  const styleDeal: CSSProperties = {
    alignItems: 'center',
    backgroundColor: '#FF9900',
    borderRadius: '50%',
    color: '#FFFFFF',
    display: 'flex',
    fontSize: '14px',
    fontWeight: 'bold',
    height: '28px',
    justifyContent: 'center',

    marginBottom: '6px',
    marginTop: 'auto',
    paddingBottom: '1px',
    width: '28px'
  }

  /**
   * 좌석을 클릭하면 해당 좌석에 착석할 유저를 고르는 창을 띄운다. \
   * - page 를 클릭하면 선택한 좌석의 인덱스를 -1로 한다. \
   * - 따라서 stopPropagation 을 호출한다.
   */
  const onClickSeat = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (gameState === STATE_INIT) {
        setSeatIdx(hereSeatIdx)
      }
    },
    [gameState, hereSeatIdx, setSeatIdx]
  )

  // Set userChips and userName
  useEffect(() => {
    const userIdx = seatUserIdxsArr[hereSeatIdx]
    if (userIdx === -1) {
      setUserChips('')
      setUserName('')
    } // BLANK LINE COMMENT:
    else {
      setUserChips((pokerUsersArr[userIdx].chips || 0).toString())
      setUserName(pokerUsersArr[userIdx].name)
    }
  }, [seatUserIdxsArr, hereSeatIdx, pokerUsersArr])
  // Set backgroundColor
  useEffect(() => {
    const userIdx = seatUserIdxsArr[hereSeatIdx]
    if (seatIdx === hereSeatIdx) {
      setBackgroundColor('#FFFF88')
    } // BLANK LINE COMMENT:
    else if (userIdx === -1) {
      setBackgroundColor('#888888')
    } // BLANK LINE COMMENT:
    else {
      const user = pokerUsersArr[userIdx]
      if (user.userStatus === USER_FOLD) {
        setBackgroundColor('#888888')
      } // BLANK LINE COMMENT:
      else {
        setBackgroundColor('#FFFFFF')
      }
    }
  }, [pokerUsersArr, seatIdx, seatUserIdxsArr, hereSeatIdx])

  return (
    <div className={`SEAT ${className || ''}`} onClick={onClickSeat} style={styleSeat} {...props}>
      <p style={styleName}>{userName}</p>
      <p style={styleChips}>{userChips}</p>
      {hereSeatIdx === dealerSeatIdx && <div style={styleDeal}>D</div>}
    </div>
  )
}
