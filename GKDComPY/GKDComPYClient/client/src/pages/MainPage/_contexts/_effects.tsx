import {createContext, useContext, useEffect} from 'react'
import {useTemplateStatesContext} from '../../../template/_contexts'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const MainPageEffectsContext = createContext<ContextType>({})

export const useMainPageEffectsContext = () => useContext(MainPageEffectsContext)

export function MainPageEffects({children}: {children: React.ReactNode}) {
  const {setWhichList} = useTemplateStatesContext()

  // Set page name
  useEffect(() => {
    setWhichList('mainPage')
  }, [setWhichList])

  // prettier-ignore
  const value = {}
  return <MainPageEffectsContext.Provider value={value}>{children}</MainPageEffectsContext.Provider>
}
