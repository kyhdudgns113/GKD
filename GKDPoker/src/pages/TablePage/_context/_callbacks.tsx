import {ChangeEvent, createContext, FC, PropsWithChildren, useCallback, useContext} from 'react'
import {useTablePageStatesContext} from './__states'
import {useTemplateGameStatesContext} from '../../../template/_context'
import {
  CalcScoreType,
  getPokerScore,
  PokerUserType,
  STATE_FINISH,
  STATE_INIT,
  STATE_PRE_FLOP,
  STATE_RIVER,
  stateString,
  USER_ALL_IN,
  USER_FOLD,
  USER_PLAYING
} from '../../../common'

// prettier-ignore
type ContextType = {
  betSizeDec: (seatIdx: number, decSize: number) => () => void,
  betSizeInc: (seatIdx: number, incSize: number) => () => void,
  betSizePotSize: (seatIdx: number, rate: number) => () => void,
  betSizeRaise: (seatIdx: number, rate: number) => () => void,

  chipGoToBankroll: (seatIdx: number, addSize: number) => void,
  chipIncFromBankroll: (seatIdx: number, addSize: number) => void,

  finishGame: () => void,

  onBlurBetSize: (seatIdx: number) => (e: ChangeEvent<HTMLInputElement>) => void,
  onChangeBetSize: (e: ChangeEvent<HTMLInputElement>) => void,

  onClickAction: (seatIdx: number, betSize: number) => () => void,
  onClickFold: (seatIdx: number) => () => void,
  onClickShowResult: (resultBtnText: string) => () => void,

  selectSeatUserLeave: (seatIdx: number) => () => void,
  selectUserToSeat: (userIdx: number, seatIdx: number) => void, 
  shiftActionIdx: (shift: number) => () => void,
  shuffleDeck: () => void,
  startGame: () => void
}
// prettier-ignore
export const TablePageCallbacksContext = createContext<ContextType>({
  betSizeDec: () => () => {},
  betSizeInc: () => () => {},
  betSizePotSize: () => () => {},
  betSizeRaise: () => () => {},

  chipGoToBankroll: () => {},
  chipIncFromBankroll: () => {},

  finishGame: () => {},

  onBlurBetSize: () => () => {},
  onChangeBetSize: () => {},

  onClickAction: () => () => {},
  onClickFold: () => () => {},
  onClickShowResult: () => () => {},

  selectSeatUserLeave: () => () => {},
  selectUserToSeat: () => {},
  shiftActionIdx: () => () => {},
  shuffleDeck: () => {},
  startGame: () => {}
})

export const useTablePageCallbacksContext = () => useContext(TablePageCallbacksContext)

export const TablePageCallbacks: FC<PropsWithChildren> = ({children}) => {
  const {bigBlind, rebuy, smallBlind} = useTemplateGameStatesContext()

  // prettier-ignore
  const {
    betSize, setBetSize,
    bigSeatIdx, setBigSeatIdx,
    dealerSeatIdx, setDealerSeatIdx,
    deck, setDeck,
    gameState, setGameState,
    lastBet, setLastBet,
    lastBetSeatIdx, setLastBetSeatIdx,
    pokerUsersArr, setPokerUsersArr,
    potSize, setPotSize,
    seatUserIdxsArr, setSeatUserIdxsArr,
    smallSeatIdx, setSmallSeatIdx,
  } = useTablePageStatesContext()
  const {setActionIdx, setResultBtnText, setSeatIdx, setShowResult} = useTablePageStatesContext()

  // AREA1: Helper Functions
  /**
   * seatIdx 의 다음 플레이 가능한 유저의 seatIdx 를 찾는다. \
   *   - seatIdx 가 -1 이 들어올 수 있다.
   *     - onClickFold 에서 다음 유저가 없는 경우가 들어올 수 있다.
   *     - -1 을 리턴한다.
   *   - 칩이 없는 유저는 건너뛴다. (올인유저는 여기서 확인)
   *   - 폴드한 유저는 건너뛴다.
   * 없으면 -1을 리턴한다.
   */
  const _findNextPlayerSeatIdx = useCallback(
    (pokerUsersArr: PokerUserType[], seatIdx: number) => {
      if (seatIdx === -1) return -1

      const arrLen = seatUserIdxsArr.length
      for (let i = 1; i < arrLen; i++) {
        const nextUserSeatIdx = (seatIdx + i) % arrLen

        if (seatUserIdxsArr[nextUserSeatIdx] !== -1) {
          const nextUserIdx = seatUserIdxsArr[nextUserSeatIdx]
          const nextUser = pokerUsersArr[nextUserIdx]
          if ((nextUser.chips || 0) > 0 && nextUser.userStatus !== USER_FOLD) {
            return nextUserSeatIdx
          }
        }
      }
      return -1
    },
    [seatUserIdxsArr]
  )
  /**
   * seatIdx 의 다음 유저가 앉아있는 seatIdx 를 찾는다. \
   * 없으면 -1을 리턴한다. \
   *   - seatIdx 에 유저가 없는 경우, seatIdx 를 리턴하면 안된다.
   */
  const _findNextUserSeatIdx = useCallback(
    (seatIdx: number) => {
      const arrLen = seatUserIdxsArr.length
      for (let i = 1; i < arrLen; i++) {
        const nextUserSeatIdx = (seatIdx + i) % arrLen
        if (seatUserIdxsArr[nextUserSeatIdx] !== -1) {
          return nextUserSeatIdx
        }
      }
      return -1
    },
    [seatUserIdxsArr]
  )
  const _isSameScore = useCallback((scoreA: CalcScoreType, scoreB: CalcScoreType) => {
    if (
      scoreA.score === scoreB.score &&
      scoreA.status[0] === scoreB.status[0] &&
      scoreA.status[1] === scoreB.status[1] &&
      scoreA.status[2] === scoreB.status[2] &&
      scoreA.status[3] === scoreB.status[3] &&
      scoreA.status[4] === scoreB.status[4]
    ) {
      return true
    }
    return false
  }, [])
  /**
   * 다른 함수들에서도 쓰기 용이하게 맨 위에다가 뒀다. \
   * export 용은 이 함수를 호출한다.
   */
  const _shuffleDeck = useCallback(() => {
    setDeck(prev => {
      const newDeck = [...prev]
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
      }
      return newDeck
    })
  }, [setDeck])
  const _resetGame = useCallback(() => {
    const newPokerUsersArr = [...pokerUsersArr]
    const newDealerSeatIdx = _findNextUserSeatIdx(dealerSeatIdx)

    newPokerUsersArr.forEach(user => {
      user.userStatus = USER_PLAYING
      user.nowBet = 0
      user.totalBet = 0
      user.chips = (user.chips || 0) + (user.resultGain || 0)
      user.resultGain = 0
    })

    setDealerSeatIdx(newDealerSeatIdx)
    setGameState(STATE_INIT)
    setLastBet(0)
    setLastBetSeatIdx(-1)
    setPokerUsersArr(newPokerUsersArr)
    setResultBtnText('결과보기')
    setSeatIdx(-1)
    setShowResult(false)
    // BLANK LINE COMMENT:
  }, [
    dealerSeatIdx,
    pokerUsersArr,
    _findNextUserSeatIdx,
    setDealerSeatIdx,
    setGameState,
    setLastBet,
    setLastBetSeatIdx,
    setPokerUsersArr,
    setResultBtnText,
    setSeatIdx,
    setShowResult
  ])

  // AREA2: Exported Functions

  const betSizeDec = useCallback(
    (seatIdx: number, decSize: number) => () => {
      if (seatIdx === -1) {
        alert(`betSizeDec: seatIdx 가 왜 -1일까?`)
        return
      }
      if (decSize < 0) {
        alert(`betSizeDec: 음수는 넣을 수 없습니다.`)
        return
      }

      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`betSizeDec: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const user = pokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userNowBet = user.nowBet || 0

      let newBetSize = betSize - decSize

      if (newBetSize > userChips) {
        newBetSize = userChips
      } // BLANK LINE COMMENT:
      else if (newBetSize <= lastBet - userNowBet) {
        newBetSize = Math.min(lastBet - userNowBet, userChips)
      } // BLANK LINE COMMENT:
      else if (lastBet <= newBetSize + userNowBet && newBetSize + userNowBet < 2 * lastBet) {
        newBetSize = Math.min(lastBet - userNowBet, userChips)
      }

      setBetSize(newBetSize)

      // 베팅을 실행하는 함수가 아니다.
      // pokerUserArr 수정할 필요 없다.
    },
    [betSize, lastBet, pokerUsersArr, seatUserIdxsArr, setBetSize]
  )
  const betSizeInc = useCallback(
    (seatIdx: number, incSize: number) => () => {
      if (seatIdx === -1) {
        alert(`betSizeInc: seatIdx 가 왜 -1일까?`)
        return
      }
      if (incSize < 0) {
        alert(`betSizeInc: 음수는 넣을 수 없습니다.`)
        return
      }

      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`betSizeInc: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const user = pokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userNowBet = user.nowBet || 0

      let newBetSize = betSize + incSize

      if (newBetSize > userChips) {
        newBetSize = userChips
      } // BLANK LINE COMMENT:
      else if (newBetSize <= lastBet - userNowBet) {
        newBetSize = Math.min(lastBet - userNowBet, userChips)
      } // BLANK LINE COMMENT:
      else if (lastBet < newBetSize + userNowBet && newBetSize + userNowBet <= 2 * lastBet) {
        newBetSize = Math.min(2 * lastBet - userNowBet, userChips)
      }

      setBetSize(newBetSize)

      // 베팅을 실행하는 함수가 아니다.
      // pokerUserArr 수정할 필요 없다.
    },
    [betSize, lastBet, pokerUsersArr, seatUserIdxsArr, setBetSize]
  )
  const betSizePotSize = useCallback(
    (seatIdx: number, rate: number) => () => {
      console.log(`betSizePotSize: seatIdx:${seatIdx}, potSize:${potSize}, rate:${rate}`)
      if (seatIdx === -1) {
        alert(`betSizePotSize: seatIdx 가 왜 -1일까?`)
        return
      }
      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`betSizePotSize: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const user = pokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userNowBet = user.nowBet || 0

      // Pot size 에 비례해서 베팅금액을 정하는 것이다.
      // nowBet 은 무시한다.
      let newBetSize = Math.floor(potSize * rate)

      if (newBetSize < 0) {
        alert(`betSizePotSize: 왜 결과값이 음수일까? ${potSize} * ${rate} = ${newBetSize}`)
        return
      } // BLANK LINE COMMENT:
      else if (newBetSize > userChips) {
        newBetSize = userChips
      } // BLANK LINE COMMENT:
      else if (newBetSize <= lastBet - userNowBet) {
        newBetSize = Math.min(lastBet - userNowBet, userChips)
      } // BLANK LINE COMMENT:
      else if (lastBet < newBetSize + userNowBet && newBetSize + userNowBet < 2 * lastBet) {
        newBetSize = Math.min(2 * lastBet - userNowBet, userChips)
      }

      setBetSize(newBetSize)

      // 베팅을 실행하는 함수가 아니다.
      // pokerUserArr 수정할 필요 없다.
    },
    [lastBet, pokerUsersArr, potSize, seatUserIdxsArr, setBetSize]
  )
  const betSizeRaise = useCallback(
    (seatIdx: number, rate: number) => () => {
      console.log(`betSizeRaise: seatIdx:${seatIdx}, lastBet:${lastBet}, rate:${rate}`)
      if (rate < 1) {
        alert(`betSizeRaise: 레이즈 비율은 1 이상이어야 합니다.`)
        return
      }
      if (seatIdx === -1) {
        alert(`betSizePotSize: seatIdx 가 왜 -1일까?`)
        return
      }
      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`betSizePotSize: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const user = pokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userNowBet = user.nowBet || 0

      let newBetSize = Math.max(0, Math.floor(lastBet * rate) - userNowBet)

      if (newBetSize > userChips) {
        newBetSize = userChips
      } // BLANK LINE COMMENT:
      else if (lastBet < newBetSize + userNowBet && newBetSize + userNowBet < 2 * lastBet) {
        newBetSize = Math.min(2 * lastBet - userNowBet, userChips)
      }

      setBetSize(newBetSize)

      // 베팅을 실행하는 함수가 아니다.
      // pokerUserArr 수정할 필요 없다.
    },
    [lastBet, pokerUsersArr, seatUserIdxsArr, setBetSize]
  )

  /**
   * 유저의 칩을 뱅크롤롤에 넣는다.
   */
  const chipGoToBankroll = useCallback(
    (seatIdx: number, addSize: number) => {
      if (seatIdx === -1) {
        alert(`chipGoToBankroll: seatIdx 가 왜 -1일까?`)
        return
      }
      if (addSize < 0) {
        alert(`chipGoToBankroll: 음수는 넣을 수 없습니다.`)
        return
      }

      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`chipGoToBankroll: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }
      const newPokerUsersArr = [...pokerUsersArr]

      const user = newPokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userBankroll = user.bankroll || 0

      const deltaChips = Math.min(addSize, userChips)
      user.chips = userChips - deltaChips
      user.bankroll = userBankroll + deltaChips

      setPokerUsersArr(newPokerUsersArr)
    },
    [pokerUsersArr, seatUserIdxsArr, setPokerUsersArr]
  )
  /**
   * 유저의 뱅크롤롤에서 칩을 빼온다.
   */
  const chipIncFromBankroll = useCallback(
    (seatIdx: number, addSize: number) => {
      if (seatIdx === -1) {
        alert(`addChipFromBankroll: seatIdx 가 왜 -1일까?`)
        return
      }
      if (addSize < 0) {
        alert(`addChipFromBankroll: 음수는 넣을 수 없습니다.`)
        return
      }

      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`addChipFromBankroll: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }
      const newPokerUsersArr = [...pokerUsersArr]

      const user = newPokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userBankroll = user.bankroll || 0

      const deltaChips = Math.min(addSize, userBankroll)
      user.chips = userChips + deltaChips
      user.bankroll = userBankroll - deltaChips

      setPokerUsersArr(newPokerUsersArr)
      // BLANK LINE COMMENT:
    },
    [pokerUsersArr, seatUserIdxsArr, setPokerUsersArr]
  )

  const finishGame = useCallback(() => {
    /**
     * 1. 유저들의 nowBet을 0으로 한다.
     * 2. 죽지 않은 유저들만 모은다.
     * 3. 죽지 않은 유저들의 점수의 배열을 구하고 정렬한다.
     * 4. 같은 점수인 유저들을 모으고, totalBet 낮은것부터 앞으로 정렬한다.
     * 5. 같은 점수 유저들에게 가장 낮은 totalBet 에 의한 칩을 배분한다.
     */
    const newPokerUsersArr = [...pokerUsersArr]
    let newPotSize = potSize

    // 1. 유저들의 nowBet을 0으로 한다.
    newPokerUsersArr.forEach(user => {
      user.nowBet = 0
    })

    // 2. 죽지 않은 유저들만 모은다.
    const aliveUsersSeatArr: number[] = []
    seatUserIdxsArr.forEach((userIdx, seatIdx) => {
      if (userIdx === -1) return

      const user = pokerUsersArr[userIdx]
      if (user.userStatus !== USER_FOLD && (user.totalBet || 0) > 0) {
        aliveUsersSeatArr.push(seatIdx)
      }
    })

    // 3. 죽지 않은 유저들의 점수의 배열을 구하고 정렬한다.
    const scoresArr = aliveUsersSeatArr.map(seatIdx => {
      const userIdx = seatUserIdxsArr[seatIdx]
      const user = pokerUsersArr[userIdx]
      const cards = [
        deck[51],
        deck[50],
        deck[49],
        deck[48],
        deck[47],
        deck[2 * seatIdx],
        deck[2 * seatIdx + 1]
      ]
      return {...getPokerScore(cards), seatIdx, userIdx, user}
    })
    scoresArr.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score
      else if (a.status[0] !== b.status[0]) return a.status[0] - b.status[0]
      else if (a.status[1] !== b.status[1]) return a.status[1] - b.status[1]
      else if (a.status[2] !== b.status[2]) return a.status[2] - b.status[2]
      else if (a.status[3] !== b.status[3]) return a.status[3] - b.status[3]
      else if (a.status[4] !== b.status[4]) return a.status[4] - b.status[4]

      return 0
    })

    // 4. 같은 점수인 유저들을 모으고, totalBet 낮은것부터 앞으로 정렬한다.
    // 5. 같은 점수 유저들에게 가장 낮은 totalBet 에 의한 칩을 배분한다.
    const lenArr = scoresArr.length
    let scoreIdx = 0
    let sameScoreArr: CalcScoreType[] = []
    while (scoreIdx < lenArr) {
      const score = scoresArr[scoreIdx]
      console.log(`finishGame: user:${score.user.name} working...`)
      const lenSame = sameScoreArr.length

      if (
        scoreIdx < lenArr - 1 &&
        (lenSame === 0 || _isSameScore(score, sameScoreArr[lenSame - 1]))
      ) {
        // Case 1. 점수가 같은 유저면 배열에 넣는다.
        // 4. 같은 점수인 유저들을 모으고, totalBet 낮은것부터 앞으로 정렬한다.
        sameScoreArr.push(score)
      } // BLANK LINE COMMENT:
      else if (scoreIdx < lenArr - 1) {
        // Case 2. 점수가 다른 유저가 발견되면 이전 배열에 대해서 계산하고 새로운 배열을 만든다.
        sameScoreArr.sort((a, b) => (a.user.totalBet || 0) - (b.user.totalBet || 0))

        // 5. 같은 점수 유저들에게 가장 낮은 totalBet 에 의한 칩을 배분한다.
        for (let nowIdx = 0; nowIdx < lenSame; nowIdx += 1) {
          const user = sameScoreArr[nowIdx].user
          const userTotBet = user.totalBet || 0
          console.log(`  ${user.name}의 totalBet: ${userTotBet}`)

          let sumTotBet = 0
          // 이번 유저에 대해서 분배할 총 팟(sumTotBet)을 구한다.
          seatUserIdxsArr.forEach(userIdx => {
            if (userIdx === -1) return

            const tempUser = pokerUsersArr[userIdx]
            const tempUserTotBet = tempUser.totalBet || 0
            const deltaTotalBet = Math.min(tempUserTotBet, userTotBet)

            sumTotBet += deltaTotalBet
            tempUser.totalBet = tempUserTotBet - deltaTotalBet
          })

          const deltaTotBet = Math.floor(sumTotBet / (lenSame - nowIdx))
          let deltaPotSize = 0

          console.log(`  ${user.name}에 의한 분배 칩: ${deltaTotBet}`)

          for (let gainIdx = nowIdx; gainIdx < lenSame; gainIdx += 1) {
            const gainUser = sameScoreArr[gainIdx].user
            const gainUserChips = gainUser.resultGain || 0

            gainUser.resultGain = gainUserChips + deltaTotBet
            console.log(`    ${gainUser.name}의 결과 칩: ${gainUser.resultGain}`)
            deltaPotSize += deltaTotBet
          }

          newPotSize -= deltaPotSize
        }

        sameScoreArr = [score]
      } // BLANK LINE COMMENT:
      else {
        // Case 3. 마지막 유저 혼자만 분배받으면 되는 상황
        const user = score.user
        const userGains = user.resultGain || 0
        const userTotBet = user.totalBet || 0

        let sumTotBet = 0
        seatUserIdxsArr.forEach(userIdx => {
          if (userIdx === -1) return

          const tempUser = pokerUsersArr[userIdx]
          const tempUserTotBet = tempUser.totalBet || 0
          const deltaTotalBet = Math.min(tempUserTotBet, userTotBet)

          sumTotBet += deltaTotalBet
          tempUser.totalBet = tempUserTotBet - deltaTotalBet
        })

        const deltaTotBet = sumTotBet
        user.resultGain = userGains + deltaTotBet
        newPotSize -= deltaTotBet
      }

      scoreIdx += 1
    }

    setPokerUsersArr(newPokerUsersArr)
    setPotSize(newPotSize)
  }, [deck, pokerUsersArr, potSize, seatUserIdxsArr, _isSameScore, setPokerUsersArr, setPotSize])

  const onBlurBetSize = useCallback(
    (seatIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      if (seatIdx === -1) {
        alert(`onBlurBetSize: seatIdx 가 왜 -1일까?`)
        return
      }

      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`onBlurBetSize: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const user = pokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userNowBet = user.nowBet || 0

      let newBetSize = e.currentTarget.valueAsNumber

      if (newBetSize < 0) {
        // 음수는 0으로 만든다.
        newBetSize = 0
      } // BLANK LINE COMMENT:
      else if (newBetSize > userChips) {
        // 칩보다 큰 베팅은 칩으로 만든다.
        newBetSize = userChips
      } // BLANK LINE COMMENT:
      else if (newBetSize < lastBet - userNowBet) {
        // 이번 베팅 총합이 lastBet 만큼은 되어야 한다.
        newBetSize = Math.min(lastBet - userNowBet, userChips)
      } // BLANK LINE COMMENT:
      else if (lastBet < newBetSize + userNowBet && newBetSize + userNowBet < 2 * lastBet) {
        // 레이즈는 2배부터 가능하다.
        // 금액이 부족하면 남은 칩을 전부 건다.
        newBetSize = Math.min(2 * lastBet - userNowBet, userChips)
      }

      setBetSize(newBetSize)
    },
    [lastBet, pokerUsersArr, seatUserIdxsArr, setBetSize]
  )
  const onChangeBetSize = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newBetSize = parseInt(e.target.value)
      setBetSize(newBetSize)
    },
    [setBetSize]
  )

  const onClickAction = useCallback(
    (seatIdx: number, betSize: number) => () => {
      console.log(
        `onClickAction: Called flop:${stateString[gameState]} seatIdx:${seatIdx} betSize:${betSize}`
      )
      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`onClickAction: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const newPokerUsersArr = [...pokerUsersArr]
      const user = newPokerUsersArr[userIdx]
      const userChips = user.chips || 0
      const userNowBet = user.nowBet || 0
      const userTotBet = user.totalBet || 0

      // 에러: 칩이 부족한 경우
      if (userChips < betSize) {
        console.log(
          `onClickAction: 칩부족 에러 seatIdx:${seatIdx} userChips:${userChips} betSize:${betSize}`
        )
        alert(`onClickAction: ${seatIdx}위치에 유저의 칩이 부족합니다.`)
        return
      }

      let newPotSize = potSize
      let newLastBet = lastBet
      let newLastBetSeatIdx = lastBetSeatIdx

      // 베팅 사이즈에 의한 값들 조절
      // betSize 는 플레이어 바뀌면 알아서 조절된다.
      newPotSize += betSize
      user.chips = userChips - betSize
      user.nowBet = userNowBet + betSize
      user.totalBet = userTotBet + betSize

      // 베팅 사이즈 갱신되었으면 lastBet 와 lastBetSeatIdx 도 갱신해야 한다.
      if (user.nowBet > newLastBet) {
        newLastBet = user.nowBet
        newLastBetSeatIdx = seatIdx
      }

      // 다음 플레이어를 찾는다.
      const nextPlayerSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, seatIdx)
      let newSeatIdx = -1
      let newGameState = -1

      // 조건 변수들...
      const isNextExist = nextPlayerSeatIdx !== -1
      const isNextLastBet = nextPlayerSeatIdx === newLastBetSeatIdx
      const isNextBig = nextPlayerSeatIdx === bigSeatIdx
      const isNextSmall = nextPlayerSeatIdx === smallSeatIdx
      const isCheckable =
        (isNextBig || isNextSmall) && gameState === STATE_PRE_FLOP && lastBet <= bigBlind
      const isRiver = gameState === STATE_RIVER
      const isPlayerMore2 = _findNextPlayerSeatIdx(newPokerUsersArr, nextPlayerSeatIdx) !== -1
      const isBBCheck =
        seatIdx === bigSeatIdx && gameState === STATE_PRE_FLOP && newLastBet <= bigBlind

      /**
       * 액션 이후 상태를 정한다.
       *
       * Case 1. 종료되지 않고 플랍 상태가 다음으로 바뀌는 경우
       *   Cond 1.1. 다음 플레이어가 존재해야함
       *   Cond 1.2. 다음 플레이어가 마지막 베터여야 함
       *   Cond 1.3. 체크 불가능해야 함
       *   Cond 1.4. 리버가 아니어야 함
       *   Cond 1.5. 잔여 플레이어가 막벳 한 명 이상이어야 함
       *    - 1.5가 1.1을 포함하지만 가독성을 위해 냅둔다.
       *    - 그래야 나중에 헷갈리지 않는다.
       * Case 2. 게임이 끝나는 경우
       *   Case 2.1. 다음 플레이어가 없는 경우
       *   Case 2.2. 다음 플레이어가 마지막 베터인데 현재 리버이거나 잔여 플레이어가 막벳 한 명인 경우
       * Case 3. 둘 다 아니면 다음 플레이어로 바꾸기만 한다.
       */
      console.log(
        `  Case 1 Check: ${isNextExist} && ${isNextLastBet} && ${!isCheckable} && ${!isRiver} && ${isPlayerMore2} || ${isBBCheck}`
      )
      console.log(
        `  Case 2 Check: ${!isNextExist} || (${isNextLastBet} && ${isRiver}) || !${isPlayerMore2}`
      )
      if (
        (isNextExist && isNextLastBet && !isCheckable && !isRiver && isPlayerMore2) ||
        isBBCheck
      ) {
        console.log(`onClickAction: Case 1, gameState to ${stateString[gameState + 1]}`)
        // Case 1. 종료되지 않고 플랍 상태가 다음으로 바뀌는 경우
        // - 플레이어들의 nowBet 을 0으로 만든다.
        // - 선택한 좌석과 게임 상태를 바꾼다.

        newPokerUsersArr.forEach(user => {
          user.nowBet = 0 // totalBet 은 0으로 만들면 안된다 -> 팟 분배에 사용함
        })
        newLastBet = 0
        newSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, dealerSeatIdx)
        newLastBetSeatIdx = newSeatIdx
        newGameState = gameState + 1
      } // BLANK LINE COMMENT:
      else if (!isNextExist || (isNextLastBet && isRiver) || !isPlayerMore2) {
        console.log(`onClickAction: Case 2, Finish Game`)
        // Case 2. 게임이 끝나는 경우
        //   Case 2.1. 다음 플레이어가 없는 경우 (나머지 모두가 올인한 경우)
        //   Case 2.2. 다음 플레이어가 마지막 베터인데 현재 리버이거나 잔여 플레이어가 막벳 한 명인 경우
        // - 선택한 좌석과 게임 상태만 바꾼다.
        // - 종료 상태일때의 액션은 useEffect 에서 처리한다.
        newSeatIdx = -1
        newGameState = STATE_FINISH
      } // BLANK LINE COMMENT:
      else {
        console.log(`onClickAction: Case 3, set seatIdx to ${nextPlayerSeatIdx}`)
        // Case 3. 둘 다 아니면 다음 플레이어로 바꾸기만 한다.
        newSeatIdx = nextPlayerSeatIdx
        newGameState = gameState
      }

      // 다시 언급하지만 betSize 는 플레이어 바뀌면 알아서 조정된다.
      setActionIdx(0)
      setGameState(newGameState)
      setLastBet(newLastBet)
      setLastBetSeatIdx(newLastBetSeatIdx)
      setPokerUsersArr(newPokerUsersArr)
      setPotSize(newPotSize)
      setSeatIdx(newSeatIdx)
    },
    [
      bigBlind,
      bigSeatIdx,
      dealerSeatIdx,
      gameState,
      lastBet,
      lastBetSeatIdx,
      pokerUsersArr,
      potSize,
      seatUserIdxsArr,
      smallSeatIdx,

      _findNextPlayerSeatIdx,
      setActionIdx,
      setGameState,
      setLastBet,
      setLastBetSeatIdx,
      setPokerUsersArr,
      setPotSize,
      setSeatIdx
    ]
  )
  const onClickFold = useCallback(
    (seatIdx: number) => () => {
      console.log(`onClickFold: ${seatIdx}`)
      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        alert(`onClickFold: ${seatIdx}위치에 유저가 없습니다.`)
        return
      }

      const newPokerUsersArr = [...pokerUsersArr]
      const user = newPokerUsersArr[userIdx]
      user.userStatus = USER_FOLD
      user.nowBet = 0 // totalBet 은 0으로 만들면 안된다 -> 팟 분배에 사용함

      // 1. 다음 플레이어를 찾는다.
      const nextPlayerSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, seatIdx)
      let newSeatIdx = -1
      let newGameState = -1
      let newLastBet = lastBet
      let newLastBetSeatIdx = lastBetSeatIdx

      // seatIdx === lastBetSeatIdx 여도 에러 아님.
      // - 체크할 수 있는 사람이 그냥 죽을수도 있음.

      // 조건 변수들...
      const isNextExist = nextPlayerSeatIdx !== -1
      const isNextLastBet = nextPlayerSeatIdx === lastBetSeatIdx
      const isNextBig = nextPlayerSeatIdx === bigSeatIdx
      const isNextSmall = nextPlayerSeatIdx === smallSeatIdx
      const isCheckable =
        (isNextBig || isNextSmall) && gameState === STATE_PRE_FLOP && lastBet <= bigBlind
      const isRiver = gameState === STATE_RIVER
      const isPlayerMore2 = _findNextPlayerSeatIdx(newPokerUsersArr, nextPlayerSeatIdx) !== -1

      /**
       * 2. 폴드 이후 상태를 정한다.
       *
       * Case 1. 종료되지 않고 플랍 상태가 다음으로 바뀌는 경우
       *   Cond 1.1. 다음 플레이어가 존재해야함
       *   Cond 1.2. 다음 플레이어가 마지막 베터여야 함
       *   Cond 1.3. 체크 불가능해야 함
       *   Cond 1.4. 리버가 아니어야 함
       *   Cond 1.5. 잔여 플레이어가 막벳 한 명 이상이어야 함
       *    - 1.5가 1.1을 포함하지만 가독성을 위해 냅둔다.
       *    - 그래야 나중에 헷갈리지 않는다.
       * Case 2. 게임이 끝나는 경우
       *   Case 2.1. 다음 플레이어가 없는 경우
       *   Case 2.2. 다음 플레이어가 마지막 베터인데 현재 리버이거나 잔여 플레이어가 막벳 한 명인 경우
       * Case 3. 둘 다 아니면 다음 플레이어로 바꾸기만 한다.
       */
      console.log(
        `  Case 1 Check: ${isNextExist} && ${isNextLastBet} && ${!isCheckable} && ${!isRiver} && ${isPlayerMore2}`
      )
      console.log(
        `  Case 2 Check: ${!isNextExist} || (${isNextLastBet} && ${isRiver}) || !${isPlayerMore2}`
      )
      if (isNextExist && isNextLastBet && !isCheckable && !isRiver && isPlayerMore2) {
        console.log(`onClickFold: Case 1, gameState to ${stateString[gameState + 1]}`)
        // Case 1. 종료되지 않고 플랍 상태가 다음으로 바뀌는 경우
        // - 플레이어 모두의 nowBet 을 0으로 만든다.
        // - 선택한 좌석과 게임 상태를 바꾼다.
        newPokerUsersArr.forEach(user => {
          user.nowBet = 0 // totalBet 은 0으로 만들면 안된다 -> 팟 분배에 사용함
        })
        newSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, dealerSeatIdx)
        newGameState = gameState + 1
        newLastBet = 0
        newLastBetSeatIdx = newSeatIdx
      } // BLANK LINE COMMENT:
      else if (!isNextExist || (isNextLastBet && isRiver) || !isPlayerMore2) {
        console.log(`onClickFold: Case 2, Finish Game`)
        // Case 2. 게임이 끝나는 경우
        //   Case 2.1. 다음 플레이어가 없는 경우 (나머지 모두가 올인한 경우)
        //   Case 2.2. 다음 플레이어가 마지막 베터인데 현재 리버이거나 잔여 플레이어가 막벳 한 명인 경우
        // - 선택한 좌석과 게임 상태만 바꾼다.
        // - 종료 상태일때의 액션은 useEffect 에서 처리한다.
        newSeatIdx = -1
        newGameState = STATE_FINISH
      } // BLANK LINE COMMENT:
      else {
        console.log(`onClickFold: Case 3, set seatIdx to ${nextPlayerSeatIdx}`)
        // Case 3. 둘 다 아니면 다음 플레이어로 바꾸기만 한다.
        newSeatIdx = nextPlayerSeatIdx
        newGameState = gameState
      }
      setActionIdx(0)
      setGameState(newGameState)
      setLastBet(newLastBet)
      setLastBetSeatIdx(newLastBetSeatIdx)
      setPokerUsersArr(newPokerUsersArr)
      setSeatIdx(newSeatIdx)
    },
    [
      bigBlind,
      bigSeatIdx,
      dealerSeatIdx,
      gameState,
      lastBet,
      lastBetSeatIdx,
      pokerUsersArr,
      seatUserIdxsArr,
      smallSeatIdx,
      _findNextPlayerSeatIdx,
      setActionIdx,
      setGameState,
      setLastBet,
      setLastBetSeatIdx,
      setPokerUsersArr,
      setSeatIdx
    ]
  )
  const onClickShowResult = useCallback(
    (resultBtnText: string) => () => {
      if (resultBtnText === '결과보기') {
        setResultBtnText('자리설정')
        finishGame()
      } // BLANK LINE COMMENT:
      else {
        _resetGame()
      }
    },
    [_resetGame, finishGame, setResultBtnText]
  )

  const selectSeatUserLeave = useCallback(
    (seatIdx: number) => () => {
      const newPokerUsersArr = [...pokerUsersArr]
      const newSeatUserIdxsArr = [...seatUserIdxsArr]

      const userIdx = newSeatUserIdxsArr[seatIdx]
      if (userIdx === -1) return

      const user = newPokerUsersArr[userIdx]

      newSeatUserIdxsArr[seatIdx] = -1
      const deltaChips = user.chips || 0
      user.bankroll += deltaChips
      user.chips = 0

      setPokerUsersArr(newPokerUsersArr)
      setSeatUserIdxsArr(newSeatUserIdxsArr)
    },
    [pokerUsersArr, seatUserIdxsArr, setPokerUsersArr, setSeatUserIdxsArr]
  )
  const selectUserToSeat = useCallback(
    (userIdx: number, seatIdx: number) => {
      const newPokerUsersArr = [...pokerUsersArr]
      const newSeatUserIdxsArr = [...seatUserIdxsArr]

      const nowUserSeatIdx = newSeatUserIdxsArr.findIndex(seatUseridx => seatUseridx === userIdx)
      const nowSeatUserIdx = newSeatUserIdxsArr[seatIdx]

      const nowUser = newPokerUsersArr[userIdx]

      // Case 1. 이미 이 유저가 다른 자리에 앉아있던 경우
      if (nowUserSeatIdx !== -1) {
        // 뱅크롤과 칩 리셋한다.
        newSeatUserIdxsArr[nowUserSeatIdx] = -1
        newSeatUserIdxsArr[seatIdx] = userIdx

        const newBankroll = nowUser.bankroll + (nowUser.chips || 0)
        const deltaChips = Math.min(newBankroll, rebuy)

        nowUser.chips = deltaChips
        nowUser.bankroll = Math.max(0, newBankroll - deltaChips)
      } // BLANK LINE COMMENT:
      else if (nowSeatUserIdx !== -1) {
        // Case 2. 이미 이 자리에 다른 유저가 앉아있던 경우
        // 뱅크롤과 칩 리셋한다.
        const alreadySeatUser = newPokerUsersArr[nowSeatUserIdx]
        alreadySeatUser.bankroll += alreadySeatUser.chips || 0
        alreadySeatUser.chips = 0

        newSeatUserIdxsArr[seatIdx] = userIdx

        const deltaChip = Math.min(rebuy, nowUser.bankroll)
        nowUser.chips = deltaChip
        nowUser.bankroll -= deltaChip
      } // BLANK LINE COMMENT:
      else {
        // Case 3. 그냥 빈자리인 경우
        newSeatUserIdxsArr[seatIdx] = userIdx

        const deltaChip = Math.min(rebuy, nowUser.bankroll)
        nowUser.chips = deltaChip
        nowUser.bankroll -= deltaChip
      }

      setPokerUsersArr(newPokerUsersArr)
      setSeatUserIdxsArr(newSeatUserIdxsArr)
    },
    [pokerUsersArr, rebuy, seatUserIdxsArr, setPokerUsersArr, setSeatUserIdxsArr]
  )
  const shiftActionIdx = useCallback(
    (shift: number) => () => {
      setActionIdx(prev => (prev + shift + 3) % 3)
    },
    [setActionIdx]
  )
  const shuffleDeck = useCallback(() => {
    _shuffleDeck()
  }, [_shuffleDeck])
  const startGame = useCallback(() => {
    /******************************************************************
     *  게임 시작 절차
     *    1. 칩 없는 유저 FOLD 상태로 만들기
     *      - 올인 상태로 만들면 나중에 팟 분배하게 된다.
     *    2. gameState 변경
     *    3. dealerButton 위치 조정
     *      - 딜러버튼 자리에 유저가 없으면 이동한다는 의미이다.
     *      - 칩 없는 유저를 고려해야 한다.
     *    4. 덱 섞기
     *    5. SB, BB 설정 및 자동 베팅
     *      - 올인 상황 나올 수 있음.
     *    6. 팟 사이즈 SB, BB 만큼 추가
     *    7. 다음 플레이어 좌석 지정 (BB 다음으로 설정)
     *      - 칩 없는 경우 고려
     *    8. lastBet 설정
     *      - 이건 무조건 BB 여야 한다.
     *        - BB 가 SB 보다 적은 칩으로 올인한 경우에도 BB 가 되어야 한다.
     *      - 만약 SB 랑 BB 랑 같거나 SB 가 더 크면 SB 가 lastBetSeatIdx 가 된다.
     *        - 잘 생각해보면 답 나온다.
     *    FINAL. 나머지 setState 해주기
     ******************************************************************/
    const newPokerUsersArr = [...pokerUsersArr]
    let newPotSize = potSize

    // 1. 칩 없는 유저 FOLD 상태로 만들기
    for (let i = 0; i < newPokerUsersArr.length; i++) {
      const user = newPokerUsersArr[i]
      if (user.chips === 0 || !user.chips) {
        user.userStatus = USER_FOLD
      } // BLANK LINE COMMENT:
      else {
        user.userStatus = USER_PLAYING
      }
    }

    // 2. gameState 변경
    setGameState(STATE_PRE_FLOP)

    // 3. dealerButton 위치 조정
    let newDealerSeatIdx = dealerSeatIdx
    if (seatUserIdxsArr[newDealerSeatIdx] === -1) {
      newDealerSeatIdx = _findNextUserSeatIdx(newDealerSeatIdx)
      if (newDealerSeatIdx === -1) {
        alert(`startGame: 3. dealerSeatIdx 가 없습니다.`)
        return
      }
    }
    setDealerSeatIdx(newDealerSeatIdx)

    // 4. 덱 섞기
    _shuffleDeck()

    // 5. SB, BB 설정 및 자동 베팅
    const sbSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, newDealerSeatIdx)
    const bbSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, sbSeatIdx)

    const sbUserIdx = seatUserIdxsArr[sbSeatIdx]
    const bbUserIdx = seatUserIdxsArr[bbSeatIdx]

    const sbUser = newPokerUsersArr[sbUserIdx]
    const bbUser = newPokerUsersArr[bbUserIdx]

    const sbDelta = Math.min(smallBlind, sbUser.chips || 0)
    sbUser.nowBet = sbDelta
    sbUser.totalBet = sbDelta
    sbUser.chips = (sbUser.chips || 0) - sbDelta // nextPlayer 로 플레이어를 찾았기 때문에 칩이 없었던 경우는 없다.
    if (sbUser.chips === 0) {
      sbUser.userStatus = USER_ALL_IN
    }

    const bbDelta = Math.min(bigBlind, bbUser.chips || 0)
    bbUser.nowBet = bbDelta
    bbUser.totalBet = bbDelta
    bbUser.chips = (bbUser.chips || 0) - bbDelta // nextPlayer 로 플레이어를 찾았기 때문에 칩이 없었던 경우는 없다.
    if (bbUser.chips === 0) {
      bbUser.userStatus = USER_ALL_IN
    }

    // 6. 팟 사이즈 SB, BB 만큼 추가
    newPotSize += sbDelta + bbDelta

    // 7. 다음 플레이어 좌석 지정 (BB 다음으로 설정)
    const newSeatIdx = _findNextPlayerSeatIdx(newPokerUsersArr, bbSeatIdx)
    if (newSeatIdx === -1) {
      alert(`startGame: 7. 다음 플레이어 좌석 지정 실패`)
      return
    }

    // 8. lastBet 설정
    const newLastBet = bigBlind
    const newLastBetSeatIdx = sbDelta >= bbDelta ? sbSeatIdx : bbSeatIdx

    // FINAL. 나머지 setState 해주기
    setBigSeatIdx(bbSeatIdx)
    setLastBet(newLastBet)
    setLastBetSeatIdx(newLastBetSeatIdx)
    setPokerUsersArr(newPokerUsersArr)
    setPotSize(newPotSize)
    setSeatIdx(newSeatIdx)
    setSmallSeatIdx(sbSeatIdx)

    // END FUNCTION: startGame
  }, [
    bigBlind,
    dealerSeatIdx,
    pokerUsersArr,
    potSize,
    seatUserIdxsArr,
    smallBlind,
    _findNextPlayerSeatIdx,
    _findNextUserSeatIdx,
    _shuffleDeck,
    setBigSeatIdx,
    setDealerSeatIdx,
    setGameState,
    setLastBet,
    setLastBetSeatIdx,
    setPokerUsersArr,
    setPotSize,
    setSeatIdx,
    setSmallSeatIdx
  ])

  // prettier-ignore
  const value: ContextType = {
    betSizeDec,
    betSizeInc,
    betSizePotSize, 
    betSizeRaise,

    chipGoToBankroll,
    chipIncFromBankroll,

    finishGame,

    onBlurBetSize,
    onChangeBetSize,

    onClickAction,
    onClickFold,
    onClickShowResult,

    selectSeatUserLeave,
    selectUserToSeat,
    shiftActionIdx,
    shuffleDeck,
    startGame
  }
  return (
    <TablePageCallbacksContext.Provider value={value}>
      {children}
    </TablePageCallbacksContext.Provider>
  )
}
