import {createContext, FC, PropsWithChildren, useEffect} from 'react'

import {useContext} from 'react'
import {useTablePageStatesContext} from './__states'

// prettier-ignore
type ContextType = {}

// prettier-ignore
export const TablePageEffectsContext = createContext<ContextType>({})

export const useTablePageEffectsContext = () => useContext(TablePageEffectsContext)

export const TablePageEffects: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const {
    deck, setDeck,
  } = useTablePageStatesContext()
  const {lastBet, pokerUsersArr, seatIdx, seatUserIdxsArr, setBetSize, setNumSeatUsers} =
    useTablePageStatesContext()

  // Init deck
  useEffect(() => {
    if (deck.length === 0) {
      setDeck(Array.from({length: 52}, (_, i) => i))
    }
  }, [deck, setDeck])

  // Set numSeatUsers
  useEffect(() => {
    setNumSeatUsers(seatUserIdxsArr.filter(seatUseridx => seatUseridx !== -1).length)
  }, [seatUserIdxsArr, setNumSeatUsers])

  // Set betSize if seatIdx is changed
  useEffect(() => {
    if (seatIdx === -1) {
      setBetSize(0)
    } // BLANK LINE COMMENT:
    else {
      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        setBetSize(0)
      } // BLANK LINE COMMENT:
      else {
        const user = pokerUsersArr[userIdx]
        const userChips = user.chips || 0
        const userNowBet = user.nowBet || 0
        setBetSize(Math.min(userChips, lastBet - userNowBet))
      }
    }
  }, [lastBet, pokerUsersArr, seatIdx, seatUserIdxsArr, setBetSize])

  const value = {}
  return (
    <TablePageEffectsContext.Provider value={value}>{children}</TablePageEffectsContext.Provider>
  )
}
