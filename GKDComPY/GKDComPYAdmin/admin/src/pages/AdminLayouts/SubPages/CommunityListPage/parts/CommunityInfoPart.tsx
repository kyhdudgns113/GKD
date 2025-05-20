import {FC, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {useCommunityListContext} from '../CommunityListPage'
import {CommunityInfoType} from '../../../../../common/shareTypes'
import {getWithJwt} from '../../../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../../../common/utils'
import {
  CommAddClubBlock,
  CommAddUserBlock,
  CommClubTableBlock,
  CommMaxClubBlock,
  CommMaxUserBlock,
  CommNameBlock,
  CommUserTableBlock
} from '../blocks'

type CommunityInfoPartProps = DivCommonProps & {}
export const CommunityInfoPart: FC<CommunityInfoPartProps> = ({className, ...props}) => {
  const {commOId, comms, commUsersArr, setClubsArr, setCommUsersArr} = useCommunityListContext()

  const [community, setCommunity] = useState<CommunityInfoType>({
    commOId: '',
    name: '',
    users: {},
    clubOIdsArr: [],
    banClubOId: '',
    maxUsers: 0,
    maxClubs: 0
  })

  // AREA1: className & style area
  const cnPartDiv = 'border-gkd-sakura-border border-l-4 h-full'

  // AREA2: Event Function AREA

  // useEffect AREA:

  // Set community
  useEffect(() => {
    if (comms[commOId]) {
      setCommunity(comms[commOId])
    } // BLANK LINE COMMENT:
    else {
      setCommunity({
        commOId: '',
        name: '',
        users: {},
        clubOIdsArr: [],
        banClubOId: '',
        maxUsers: 0,
        maxClubs: 0
      })
    }
  }, [commOId, comms])
  // Get Community's users
  useEffect(() => {
    if (commOId) {
      getWithJwt(`/admin/community/getUsers/${commOId}`)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setCommUsersArr(body.commUsersArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/community/getUsers ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`/admin/community/getUsers CATCH`, errObj))
    }
  }, [commOId, comms, setCommUsersArr])
  // Get Community's clubs
  useEffect(() => {
    if (commOId) {
      getWithJwt(`/admin/community/getClubsArr/${commOId}`)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setClubsArr(body.clubsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`/admin/community/getClubsArr/ ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`/admin/community/getClubsArr/ CATCH`, errObj))
    }
  }, [commOId, comms, setClubsArr])

  // TSX AREA:
  return (
    <div className={`flex flex-col ${cnPartDiv} ${className}`} {...props}>
      <CommNameBlock className={`mt-6 ml-8 `} community={community} />
      <div className="flex flex-row ml-8 mt-8 w-fit">
        <div className="COL_USER flex flex-col">
          <CommAddUserBlock className="ml-2 mb-4" commOId={commOId} />
          <CommMaxUserBlock className="mb-4" community={community} />
          <CommUserTableBlock community={community} commUsersArr={commUsersArr} />
        </div>
        <div className="COL_CLUB flex flex-col ml-8">
          <CommAddClubBlock className="mb-4" />
          <CommMaxClubBlock className="mb-4" community={community} />
          <CommClubTableBlock />
        </div>
      </div>
      {/* END TSX */}
    </div>
  )
}
