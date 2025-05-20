import {createContext, FC, PropsWithChildren, useContext} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const GameSettingEffectsContext = createContext<ContextType>({
  
})

export const useGameSettingEffectsContext = () => useContext(GameSettingEffectsContext)

export const GameSettingEffects: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value = {
    
  }
  return (
    <GameSettingEffectsContext.Provider value={value}>
      {children}
    </GameSettingEffectsContext.Provider>
  )
}
