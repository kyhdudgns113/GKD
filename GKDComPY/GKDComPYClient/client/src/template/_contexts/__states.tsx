import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {
  ClubInfoType,
  CommunityInfoType,
  UserInfoAuthType
} from '../../common/typesAndValues/shareTypes'
import {Setter} from '../../common'

// prettier-ignore
type ContextType = {
  banClub: ClubInfoType, setBanClub: Setter<ClubInfoType>,
  banClubOId: string, setBanClubOId: Setter<string>,
  clubs: {[clubOId: string]: ClubInfoType}, setClubs: Setter<{[clubOId: string]: ClubInfoType}>,
  clubsArr: ClubInfoType[], setClubsArr: Setter<ClubInfoType[]>
  comm: CommunityInfoType, setComm: Setter<CommunityInfoType>,

  selectedClubIdx: number | null, setSelectedClubIdx: Setter<number | null>,
  users: {[uOId: string]: UserInfoAuthType}, setUsers: Setter<{[uOId: string]: UserInfoAuthType}>,
  usersArr: UserInfoAuthType[], setUsersArr: Setter<UserInfoAuthType[]>,
  whichList: string, setWhichList: Setter<string>,
}
// prettier-ignore
export const TemplateStatesContext = createContext<ContextType>({
  banClub: {
    clubOId: '', name: '',
    commOId: '',
    weekRowsArr: [],
    chatRoomOId: '',
    docOId: ''
  }, setBanClub: () => {},
  banClubOId: '', setBanClubOId: () => {},
  clubs: {}, setClubs: () => {},
  clubsArr: [], setClubsArr: () => {},
  comm: {commOId: '',
    name: '',
    users: {},
    clubOIdsArr: [],
    banClubOId: '',
  maxUsers: 0, maxClubs: 0}, setComm: () => {},

  selectedClubIdx: null, setSelectedClubIdx: () => {},
  users: {}, setUsers: () => {},
  usersArr: [], setUsersArr: () => {},
  whichList: '', setWhichList: () => {},
})

export const useTemplateStatesContext = () => {
  return useContext(TemplateStatesContext)
}

// AREA4: Layout AREA
export const TemplateStates: FC<PropsWithChildren> = ({children}) => {
  const [banClub, setBanClub] = useState<ClubInfoType>({
    clubOId: '',
    name: '',
    commOId: '',
    weekRowsArr: [],
    chatRoomOId: '',
    docOId: ''
  })
  const [banClubOId, setBanClubOId] = useState<string>('')
  const [clubs, setClubs] = useState<{[clubOId: string]: ClubInfoType}>({})
  const [clubsArr, setClubsArr] = useState<ClubInfoType[]>([])
  const [comm, setComm] = useState<CommunityInfoType>({
    commOId: '',
    name: '',
    users: {},
    clubOIdsArr: [],
    banClubOId: '',
    maxUsers: 0,
    maxClubs: 0
  })
  const [selectedClubIdx, setSelectedClubIdx] = useState<number | null>(null)
  const [users, setUsers] = useState<{[uOId: string]: UserInfoAuthType}>({})
  const [usersArr, setUsersArr] = useState<UserInfoAuthType[]>([])
  const [whichList, setWhichList] = useState<string>('')

  // prettier-ignore
  const value = {
    banClub, setBanClub,
    banClubOId, setBanClubOId,
    clubs, setClubs,
    clubsArr, setClubsArr,
    comm, setComm,

    selectedClubIdx, setSelectedClubIdx,
    users, setUsers,
    usersArr, setUsersArr,
    whichList, setWhichList,
  }
  return <TemplateStatesContext.Provider value={value}>{children}</TemplateStatesContext.Provider>
}
