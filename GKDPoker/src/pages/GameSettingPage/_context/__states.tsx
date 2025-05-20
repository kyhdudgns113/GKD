import {createContext, FC, PropsWithChildren, useContext} from 'react'
import {useTemplateGameStatesContext} from '../../../template/_context'
import {Setter} from '../../../common'

// prettier-ignore
type ContextType = {
  bigBlind: number, setBigBlind: Setter<number>,
  rebuy: number, setRebuy: Setter<number>,
  smallBlind: number, setSmallBlind: Setter<number>
}
// prettier-ignore
export const GameSettingStatesContext = createContext<ContextType>({
  bigBlind: 2, setBigBlind: () => {},
  rebuy: 100, setRebuy: () => {},
  smallBlind: 1, setSmallBlind: () => {}
})

export const useGameSettingStatesContext = () => useContext(GameSettingStatesContext)

export const GameSettingStates: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const {
    bigBlind, setBigBlind,
    rebuy, setRebuy,
    smallBlind, setSmallBlind
  } = useTemplateGameStatesContext()

  // prettier-ignore
  const value = {
    bigBlind, setBigBlind,
    rebuy, setRebuy,
    smallBlind, setSmallBlind
  }
  return (
    <GameSettingStatesContext.Provider value={value}>{children}</GameSettingStatesContext.Provider>
  )
}
