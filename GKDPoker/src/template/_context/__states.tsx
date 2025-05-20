import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {Setter, STATE_INIT} from '../../common'

// prettier-ignore
type ContextType = {
  gameState: number, setGameState: Setter<number>,
  pageState: string, setPageState: Setter<string>,
}
// prettier-ignore
export const TemplateStatesContext = createContext<ContextType>({
  gameState: STATE_INIT, setGameState: () => {},
  pageState: 'gameSetting', setPageState: () => {},
})

export const useTemplateStatesContext = () => useContext(TemplateStatesContext)

export const TemplateStates: FC<PropsWithChildren> = ({children}) => {
  const [gameState, setGameState] = useState<number>(STATE_INIT)
  const [pageState, setPageState] = useState<string>('gameSetting')

  // prettier-ignore
  const value = {
    gameState, setGameState,
    pageState, setPageState,
  }
  return <TemplateStatesContext.Provider value={value}>{children}</TemplateStatesContext.Provider>
}
