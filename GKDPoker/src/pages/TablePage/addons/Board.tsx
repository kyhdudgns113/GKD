import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps, STATE_INIT, USER_FOLD} from '../../../common'
import {useTablePageStatesContext} from '../_context'

type BoardProps = DivCommonProps & {
  isBottom?: string
  isLeft?: string
  isRight?: string
  isTop?: string
  hereSeatIdx: number
}
export const Board: FC<BoardProps> = ({
  isBottom,
  isLeft,
  isRight,
  isTop,
  hereSeatIdx,
  className,
  ...props
}) => {
  const {gameState, pokerUsersArr, seatUserIdxsArr, setSeatIdx} = useTablePageStatesContext()

  const [backgroundColor, setBackgroundColor] = useState<string>('transparent')
  const [nowBet, setNowBet] = useState<string>('')

  const styleBoard: CSSProperties = {
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

    paddingTop: '4px',
    width: '80px'
  }
  const styleNowBet: CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center'
  }

  const onClickBoard = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (gameState === STATE_INIT) {
        setSeatIdx(hereSeatIdx)
      }
    },
    [gameState, hereSeatIdx, setSeatIdx]
  )

  // Set nowBet
  useEffect(() => {
    const userIdx = seatUserIdxsArr[hereSeatIdx]
    if (userIdx === -1) {
      setNowBet('')
    } // BLANK LINE COMMENT:
    else {
      setNowBet((pokerUsersArr[userIdx].nowBet || 0).toString())
    }
  }, [seatUserIdxsArr, hereSeatIdx, pokerUsersArr])

  // Set backgroundColor
  useEffect(() => {
    const userIdx = seatUserIdxsArr[hereSeatIdx]

    if (userIdx === -1) {
      setBackgroundColor('#004400')
    } // BLANK LINE COMMENT:
    else {
      const user = pokerUsersArr[userIdx]
      if (user.userStatus === USER_FOLD) {
        setBackgroundColor('#004400')
      } // BLANK LINE COMMENT:
      else {
        setBackgroundColor('transparent')
      }
    }
  }, [hereSeatIdx, seatUserIdxsArr, pokerUsersArr])

  return (
    <div
      className={`BOARD ${className || ''}`}
      onClick={onClickBoard}
      style={styleBoard}
      {...props} // BLANK LINE COMMENT:
    >
      <p style={styleNowBet}>{nowBet}</p>
    </div>
  )
}
