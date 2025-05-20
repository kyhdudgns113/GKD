import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {Setter} from '../../common'

// prettier-ignore
type ContextType = {
  bigBlind: number, setBigBlind: Setter<number>,
  rebuy: number, setRebuy: Setter<number>,
  smallBlind: number, setSmallBlind: Setter<number>
}
// prettier-ignore
export const TemplateGameStatesContext = createContext<ContextType>({
  bigBlind: 2, setBigBlind: () => {},
  rebuy: 100, setRebuy: () => {},
  smallBlind: 1, setSmallBlind: () => {}
})

export const useTemplateGameStatesContext = () => useContext(TemplateGameStatesContext)

export const TemplateGameStates: FC<PropsWithChildren> = ({children}) => {
  const [bigBlind, setBigBlind] = useState<number>(2)
  const [rebuy, setRebuy] = useState<number>(100)
  const [smallBlind, setSmallBlind] = useState<number>(1)

  // prettier-ignore
  const value = {
    bigBlind, setBigBlind,
    rebuy, setRebuy,
    smallBlind, setSmallBlind
  }
  return (
    <TemplateGameStatesContext.Provider value={value}>
      {children}
    </TemplateGameStatesContext.Provider>
  )
}
