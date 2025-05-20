import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {PokerUserType, Setter} from '../../common'

// prettier-ignore
type ContextType = {
  pokerUsers: {[uOId: string]: PokerUserType}, setPokerUsers: Setter<{[uOId: string]: PokerUserType}>,
  pokerUsersArr: PokerUserType[], setPokerUsersArr: Setter<PokerUserType[]>
}
// prettier-ignore
export const TemplateUserStatesContext = createContext<ContextType>({
  pokerUsers: {}, setPokerUsers: () => {},
  pokerUsersArr: [], setPokerUsersArr: () => {}
})

export const useTemplateUserStatesContext = () => useContext(TemplateUserStatesContext)

export const TemplateUserStates: FC<PropsWithChildren> = ({children}) => {
  const [pokerUsers, setPokerUsers] = useState<{[uOId: string]: PokerUserType}>({})
  const [pokerUsersArr, setPokerUsersArr] = useState<PokerUserType[]>([])

  // prettier-ignore
  const value = {
    pokerUsers, setPokerUsers,
    pokerUsersArr, setPokerUsersArr
  }
  return (
    <TemplateUserStatesContext.Provider value={value}>
      {children}
    </TemplateUserStatesContext.Provider>
  )
}
