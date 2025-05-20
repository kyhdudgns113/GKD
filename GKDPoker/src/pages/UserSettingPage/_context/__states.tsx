import {createContext, FC, PropsWithChildren, useContext} from 'react'
import {useTemplateUserStatesContext} from '../../../template/_context'
import {PokerUserType, Setter} from '../../../common'

// prettier-ignore
type ContextType = {
  pokerUsers: {[uOId: string]: PokerUserType}, setPokerUsers: Setter<{[uOId: string]: PokerUserType}>,
  pokerUsersArr: PokerUserType[], setPokerUsersArr: Setter<PokerUserType[]>
}
// prettier-ignore
export const UserSettingStatesContext = createContext<ContextType>({
  pokerUsers: {}, setPokerUsers: () => {},
  pokerUsersArr: [], setPokerUsersArr: () => {}
})

export const useUserSettingStatesContext = () => useContext(UserSettingStatesContext)

export const UserSettingStates: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const {
    pokerUsers, setPokerUsers,
    pokerUsersArr, setPokerUsersArr
  } = useTemplateUserStatesContext()

  // prettier-ignore
  const value = {
    pokerUsers, setPokerUsers,
    pokerUsersArr, setPokerUsersArr
  }
  return (
    <UserSettingStatesContext.Provider value={value}>{children}</UserSettingStatesContext.Provider>
  )
}
