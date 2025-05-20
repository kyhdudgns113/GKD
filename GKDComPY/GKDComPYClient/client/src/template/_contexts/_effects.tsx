import {createContext, useContext, FC, PropsWithChildren, useEffect} from 'react'
import {ClubInfoType} from '../../common/typesAndValues/shareTypes'
import {getWithJwt} from '../../common/server'
import {useTemplateStatesContext} from './__states'
import {alertErrors, writeJwtFromServer} from '../../common/utils'
import {useAuthContext, useSocketContext} from '../../contexts'

type ContextType = {}

export const TemplateEffectsContext = createContext<ContextType>({})

export const useTemplateEffectsContext = () => useContext(TemplateEffectsContext)

export const TemplateEffects: FC<PropsWithChildren> = ({children}) => {
  const {uOId} = useAuthContext()
  const {initMainSocket, resetMainSocket} = useSocketContext()

  const {
    clubsArr,
    comm,
    users,
    setBanClubOId,
    setClubs,
    setClubsArr,
    setComm,
    setUsers,
    setUsersArr
  } = useTemplateStatesContext()

  // Get now user's community info(comm) & users & clubsArr
  useEffect(() => {
    if (uOId) {
      getWithJwt(`/client/getUserCommInfo/${uOId}`)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setComm(body.comm)
            setUsers(body.users)
            setClubsArr(body.clubsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/client/getUserCommInfo/${uOId} ELSE`, errObj)
          }
        })
        .catch(errObj => {
          alertErrors(`/client/getUserCommInfo/${uOId} CATCH`, errObj)
        })
      initMainSocket(uOId)
    }
    return () => {
      resetMainSocket()
    }
  }, [uOId, initMainSocket, resetMainSocket, setComm, setUsers, setClubsArr])
  // Get usersArr and sort
  useEffect(() => {
    const uOIdsArr = Object.keys(users)
    if (uOIdsArr.length > 0) {
      const newArr = uOIdsArr.map(uOId => users[uOId])
      newArr.sort((user1, user2) => {
        // 유저 권한별로는 정렬 안한다.
        // if (user1.authVal !== user2.authVal) {
        //   return user2.authVal - user1.authVal
        // } // BLANK LINE COMMENT:
        // else {
        if (user1.id === users[uOId].id) {
          return 1
        } // BLANK LINE COMMENT:
        else if (user2.id === users[uOId].id) {
          return -1
        } // BLANK LINE COMMENT:
        else {
          return -user2.id.localeCompare(user1.id)
        }
        // }
      })
      setUsersArr(newArr)
    }
  }, [uOId, users, setUsersArr])
  // Set clubs
  useEffect(() => {
    if (clubsArr.length > 0) {
      const clubs: {[clubOId: string]: ClubInfoType} = {}
      clubsArr.forEach((club, idx) => {
        clubs[club.clubOId] = club
      })
      setClubs(clubs)
    }
  }, [clubsArr, setClubs])
  // Set banClubOId
  useEffect(() => {
    if (comm) {
      setBanClubOId(comm.banClubOId)
    }
  }, [comm, setBanClubOId])

  const value = {}
  return <TemplateEffectsContext.Provider value={value}>{children}</TemplateEffectsContext.Provider>
}
