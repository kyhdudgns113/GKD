import {createContext, FC, PropsWithChildren, useContext} from 'react'

type ContextType = {}
export const UserSettingEffectsEffectsContext = createContext<ContextType>({})

export const useUserSettingEffectsContext = () => useContext(UserSettingEffectsEffectsContext)

export const UserSettingEffects: FC<PropsWithChildren> = ({children}) => {
  const value = {}
  return (
    <UserSettingEffectsEffectsContext.Provider value={value}>
      {children}
    </UserSettingEffectsEffectsContext.Provider>
  )
}
