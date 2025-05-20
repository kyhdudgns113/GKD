import {createContext, FC, PropsWithChildren, useCallback, useContext} from 'react'
import {get} from '../../common/server'
import {alertErrors} from '../../common/utils'
import {useTemplateUserStatesContext} from './__statesUser'

// prettier-ignore
type ContextType = {
  onClickLoad: () => void
}
// prettier-ignore
export const TemplateCallbacksContext = createContext<ContextType>({
  onClickLoad: () => {}
})

export const useTemplateCallbacksContext = () => useContext(TemplateCallbacksContext)

export const TemplateCallbacks: FC<PropsWithChildren> = ({children}) => {
  const {setPokerUsers, setPokerUsersArr} = useTemplateUserStatesContext()

  const onClickLoad = useCallback(() => {
    const url = `/poker/loadUsers`
    get(url, '')
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj} = res
        if (ok) {
          setPokerUsers(body.pokerUsers)
          setPokerUsersArr(body.pokerUsersArr)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [setPokerUsers, setPokerUsersArr])

  // prettier-ignore
  const value = {
    onClickLoad
  }
  return (
    <TemplateCallbacksContext.Provider value={value}>{children}</TemplateCallbacksContext.Provider>
  )
}
