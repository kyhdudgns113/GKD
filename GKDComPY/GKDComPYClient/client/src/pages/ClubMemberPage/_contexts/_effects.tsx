import {createContext, FC, PropsWithChildren, useContext, useEffect} from 'react'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useClubMemberStatesContext} from './__states'
import {useNavigate} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
type ContextType = {}

export const ClubMemberEffectsContext = createContext<ContextType>({})

export const useClubMemberEffectsContext = () => useContext(ClubMemberEffectsContext)

export const ClubMemberEffects: FC<PropsWithChildren> = ({children}) => {
  const {clubsArr, selectedClubIdx, setSelectedClubIdx, setWhichList} = useTemplateStatesContext()

  const {setMemOId} = useClubMemberStatesContext()

  const location = useLocation()
  const navigate = useNavigate()

  // memOId초기화 부분
  useEffect(() => {
    setMemOId('')
  }, [selectedClubIdx, setMemOId])
  // Set page name
  useEffect(() => {
    if (clubsArr.length > 0) {
      const newSelClubIdx = parseInt(location.pathname.split('client/club/member/')[1])
      if (newSelClubIdx >= clubsArr.length) {
        alert('이런거 하지 말아주세요 ㅠㅠ')
        navigate('/')
      } // BLANK LINE COMMENT:
      else {
        setSelectedClubIdx(newSelClubIdx)
        setWhichList('member')
      }
    }
  }, [clubsArr, location, navigate, setSelectedClubIdx, setWhichList])

  // prettier-ignore
  const value = {}
  return (
    <ClubMemberEffectsContext.Provider value={value}>{children}</ClubMemberEffectsContext.Provider>
  )
}
