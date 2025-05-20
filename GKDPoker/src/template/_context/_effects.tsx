import {createContext, FC, PropsWithChildren, useContext, useEffect} from 'react'
import {useTemplateUserStatesContext} from './__statesUser'
import {useTemplateCallbacksContext} from './_callbacks'
type ContextType = {}
export const TemplateEffectsContext = createContext<ContextType>({})

export const useTemplateEffectsContext = () => useContext(TemplateEffectsContext)

export const TemplateEffects: FC<PropsWithChildren> = ({children}) => {
  const {pokerUsersArr} = useTemplateUserStatesContext()
  const {onClickLoad} = useTemplateCallbacksContext()

  useEffect(() => {
    if (pokerUsersArr.length === 0) {
      onClickLoad()
    }
  }, [pokerUsersArr, onClickLoad])

  const value = {}
  return <TemplateEffectsContext.Provider value={value}>{children}</TemplateEffectsContext.Provider>
}
