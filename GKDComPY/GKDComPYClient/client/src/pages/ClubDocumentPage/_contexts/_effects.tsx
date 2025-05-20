import {createContext, FC, PropsWithChildren, useContext, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useNavigate} from 'react-router-dom'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const DocumentEffectsContext = createContext<ContextType>({})

export const useDocumentEffectsContext = () => useContext(DocumentEffectsContext)

export const DocumentEffects: FC<PropsWithChildren> = ({children}) => {
  const {clubsArr, setSelectedClubIdx, setWhichList} = useTemplateStatesContext()

  const location = useLocation()
  const navigate = useNavigate()

  // Set page name
  useEffect(() => {
    if (clubsArr.length > 0) {
      const newSelClubIdx = parseInt(location.pathname.split('client/club/document/')[1])
      if (newSelClubIdx >= clubsArr.length) {
        alert('이런거 하지 말아주세요 ㅠㅠ')
        navigate('/')
      }
      setSelectedClubIdx(newSelClubIdx)
      setWhichList('document')
    }
  }, [clubsArr, location, navigate, setSelectedClubIdx, setWhichList])

  // prettier-ignore
  const value = {}
  return <DocumentEffectsContext.Provider value={value}>{children}</DocumentEffectsContext.Provider>
}
