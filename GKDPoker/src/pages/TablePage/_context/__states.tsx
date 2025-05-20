import {FC, PropsWithChildren, useContext, useState} from 'react'
import {createContext} from 'react'
import {PokerUserType, Setter, STATE_INIT} from '../../../common'
import {
  useTemplateGameStatesContext,
  useTemplateStatesContext,
  useTemplateTableStatesContext,
  useTemplateUserStatesContext
} from '../../../template/_context'

// prettier-ignore
type ContextType = {
  rebuy: number,

  gameState: number, setGameState: Setter<number>,
  pokerUsersArr: PokerUserType[], setPokerUsersArr: Setter<PokerUserType[]>,
  seatUserIdxsArr: number[], setSeatUserIdxsArr: Setter<number[]>,

  actionIdx: number, setActionIdx: Setter<number>,
  betSize: number, setBetSize: Setter<number>,
  bigSeatIdx: number, setBigSeatIdx: Setter<number>,
  dealerSeatIdx: number, setDealerSeatIdx: Setter<number>,
  deck: number[], setDeck: Setter<number[]>,
  lastBet: number, setLastBet: Setter<number>,
  lastBetSeatIdx: number, setLastBetSeatIdx: Setter<number>,
  numSeatUsers: number, setNumSeatUsers: Setter<number>,
  potSize: number, setPotSize: Setter<number>,
  resultBtnText: string, setResultBtnText: Setter<string>,
  seatIdx: number, setSeatIdx: Setter<number>,
  showResult: boolean, setShowResult: Setter<boolean>,
  smallSeatIdx: number, setSmallSeatIdx: Setter<number>,
}
// prettier-ignore
export const TablePageStatesContext = createContext<ContextType>({
  rebuy: 100,

  gameState: STATE_INIT, setGameState: () => {},
  pokerUsersArr: [], setPokerUsersArr: () => {},
  seatUserIdxsArr: [], setSeatUserIdxsArr: () => {},

  actionIdx: 0, setActionIdx: () => {},
  betSize: 0, setBetSize: () => {},
  bigSeatIdx: -1, setBigSeatIdx: () => {},
  dealerSeatIdx: 0, setDealerSeatIdx: () => {},
  deck: [], setDeck: () => {},
  lastBet: 0, setLastBet: () => {},
  lastBetSeatIdx: -1, setLastBetSeatIdx: () => {},
  numSeatUsers: 0, setNumSeatUsers: () => {},
  potSize: 0, setPotSize: () => {},
  resultBtnText: '결과보기', setResultBtnText: () => {},
  seatIdx: -1, setSeatIdx: () => {},
  showResult: false, setShowResult: () => {},
  smallSeatIdx: -1, setSmallSeatIdx: () => {},
})

export const useTablePageStatesContext = () => useContext(TablePageStatesContext)

export const TablePageStates: FC<PropsWithChildren> = ({children}) => {
  const {gameState, setGameState} = useTemplateStatesContext()
  const {rebuy} = useTemplateGameStatesContext()
  const {pokerUsersArr, setPokerUsersArr} = useTemplateUserStatesContext()
  const {seatUserIdxsArr, setSeatUserIdxsArr} = useTemplateTableStatesContext()

  const [actionIdx, setActionIdx] = useState<number>(0)
  const [betSize, setBetSize] = useState<number>(0)
  const [bigSeatIdx, setBigSeatIdx] = useState<number>(-1)
  const [dealerSeatIdx, setDealerSeatIdx] = useState<number>(0)
  const [deck, setDeck] = useState<number[]>([])
  const [lastBet, setLastBet] = useState<number>(0)
  const [lastBetSeatIdx, setLastBetSeatIdx] = useState<number>(-1)
  const [numSeatUsers, setNumSeatUsers] = useState<number>(0)
  const [potSize, setPotSize] = useState<number>(0)
  const [resultBtnText, setResultBtnText] = useState<string>('결과보기')
  const [seatIdx, setSeatIdx] = useState<number>(-1)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [smallSeatIdx, setSmallSeatIdx] = useState<number>(-1)

  // prettier-ignore
  const value = {
    rebuy,

    gameState, setGameState,
    pokerUsersArr, setPokerUsersArr,
    seatUserIdxsArr, setSeatUserIdxsArr,

    actionIdx, setActionIdx,
    betSize, setBetSize,
    bigSeatIdx, setBigSeatIdx,
    dealerSeatIdx, setDealerSeatIdx,
    deck, setDeck,
    lastBet, setLastBet,
    lastBetSeatIdx, setLastBetSeatIdx,
    numSeatUsers, setNumSeatUsers,
    potSize, setPotSize,
    resultBtnText, setResultBtnText,
    seatIdx, setSeatIdx,
    showResult, setShowResult,
    smallSeatIdx, setSmallSeatIdx,
  }
  return <TablePageStatesContext.Provider value={value}>{children}</TablePageStatesContext.Provider>
}
