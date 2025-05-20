import {createContext, useContext, useEffect} from 'react'
import {useTemplateStatesContext} from '../../../template/_contexts'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const EntireMemberEffectsContext = createContext<ContextType>({})

export const useEntireMemberEffectsContext = () => useContext(EntireMemberEffectsContext)

export function EntireMemberEffects({children}: {children: React.ReactNode}) {
  const {setWhichList} = useTemplateStatesContext()

  // Set page name
  useEffect(() => {
    setWhichList('entireMember')
  }, [setWhichList])

  // prettier-ignore
  const value = {}
  return (
    <EntireMemberEffectsContext.Provider value={value}>
      {children}
    </EntireMemberEffectsContext.Provider>
  )
}
