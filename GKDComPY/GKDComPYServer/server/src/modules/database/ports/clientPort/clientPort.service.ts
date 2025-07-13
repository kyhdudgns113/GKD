import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'
import {
  AddUserDataType,
  JwtPayloadType,
  LogInDataType,
  UserInfoAuthType,
  SetUserInfoDataType,
  AddClubDataType,
  ModifySelfInfoDataType,
  MemberInfoType,
  AddMemberDataType,
  SetMemberPowerDataType,
  AddNextWeekDataType,
  RecordMemberInfoType,
  SetDailyRecordType,
  SetTHeadDataType,
  AddRowMemberDataType,
  SetRowMemberDataType,
  SetMemberPosDataType,
  SetCommentDataType,
  DeleteRowMemDataType,
  SetCardInfoDataType,
  ChangeMemClubDataType,
  AddPrevWeekDataType,
  SetMemberCommentDataType,
  DeleteWeekRowDataType,
  SetWeeklyCommentDataType,
  SetMemberInfoDataType,
  SetDocumentDataType,
  EMemberType,
  SetEMemMatrixDataType
} from '../../../../common/types'
import {
  findWeekRowIdx,
  getEndValue,
  getStartValue,
  getTodayValue,
  shiftDateValue
} from '../../../../common/utils'
import {ClubChatType} from '../../../../common/types/socketTypes'
import e from 'express'
import {GKDLockService} from '../../../../modules/gkdLock/gkdLock.service'

// NOTE: 권한 췍 잊지말자!!!
@Injectable()
export class ClientPortService {
  constructor(
    private readonly dbHubService: DatabaseHubService,
    private readonly lockService: GKDLockService
  ) {}

  // AREA1: Root Area
  async getUserCommInfo(jwtPayload: JwtPayloadType, uOId: string) {
    const where = '/client/getUserCommInfo'
    try {
      // payload 가 uOId 가 속한 공동체 정보를 읽어야 한다.
      // 쓸 권한이 필요하진 않다.
      await this.dbHubService.checkUserDBRead(jwtPayload, where, uOId)

      if (!uOId) throw {gkd: {uOId: '뭔 이상한 유저를 넘겨왔어?'}, gkdStatus: {uOId}, where}
      const {user} = await this.dbHubService.readUserByUOId(where, uOId)
      const {commOId} = user
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)

      // users 만드는 곳
      // UserDB 의 스키마에는 authVal 을 둬선 안되기 때문에 이렇게 해야 했다.
      const {users} = await this._getUsersFromDB(where, commOId)

      // clubs 가져오는 곳
      const {clubsArr} = await this._getClubsArrSortedFromDB(where, commOId)

      return {comm, users, clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async logIn(data: LogInDataType) {
    const where = '/client/logIn'
    try {
      const {id, password} = data
      // 인자 에러 처리
      if (!id) throw {gkd: {id: 'ID 가 왜 비어있어?'}, gkdStatus: {}, where}
      if (!password) throw {gkd: {password: '비번이 왜 비어있어?'}, gkdStatus: {id}, where}

      const {user} = await this.dbHubService.readUserByIdPassword(where, id, password)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setAllMemOId(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/setAllMemOId'
    try {
      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      if (!commOId) throw {gkd: {commOId: `공동체 안 들어옴`}, gkdStatus: {commOId}, where}

      // clubOIdsArr 뙇!!
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      if (!comm) throw {gkd: {comm: `공동체가 DB에 없어요`}, gkdStatus: {commOId}, where}
      const {clubOIdsArr} = comm

      // 전체 멤버 뙇!!
      const {entireMembersArr} = await this._getEMemObjectsFromDB(where, commOId)

      // 작업 뙇!!
      let i = 1
      for (let member of entireMembersArr) {
        console.log(`${i} 번째 멤버를 작업중입니다.`)
        i += 1
        for (let clubOId of clubOIdsArr) {
          await this.dbHubService.updateWeeklyMemOId(where, clubOId, member)
          await this.dbHubService.updateDailyMemOId(where, clubOId, member)
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async onClickQuestion(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/onClickQuestion'
    try {
      await this.dbHubService.updateEMemArrColIdx(where, commOId, 1, 10)
      await this.dbHubService.updateEMemArrColIdx(where, commOId, 2, 1)
      await this.dbHubService.updateEMemArrColIdx(where, commOId, 3, 2)
      await this.dbHubService.updateEMemArrColIdx(where, commOId, 4, 3)
      await this.dbHubService.updateEMemArrColIdx(where, commOId, 10, 4)
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: Main Area
  async addBanClubByMain(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const where = '/client/main/addBanClubByMain'
    try {
      const {commOId, name} = data
      if (!commOId || commOId === 'admin') {
        throw {gkd: {commOId: '이상한 공동체로의 요청입니다.'}, gkdStatus: {commOId}, where}
      }
      if (name !== '탈퇴')
        throw {gkd: {name: '탈퇴 클럽만 가능해요 ㅠㅠ'}, gkdStatus: {name}, where}

      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 공동체에 BanCOId 이미 있나 췍!!
      const {comm: prevComm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const {banClubOId} = prevComm
      if (banClubOId) {
        throw {
          gkd: {banClubOId: '탈퇴 클럽이 이미 공동체에 존재합니다.'},
          gkdStatus: {banClubOId},
          where
        }
      }

      // 클럽 생성 뙇!!
      await this.dbHubService.createClub(where, commOId, name)

      // 클럽 OID 을 얻기 위해 뙇!
      const {club} = await this.dbHubService.readClubByName(where, commOId, name)

      // 공동체 클럽의 탈퇴 멤버 클럽에 뙇!
      await this.dbHubService.updateCommBCOId(where, commOId, club.clubOId)

      // 리턴용 공동체 뙇!!
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async addClubByMain(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    /**
     * 탈퇴멤버 클럽은 여기서 안 만든다.
     */
    const where = '/client/main/addClubByMain'
    try {
      const {commOId, name} = data
      if (!commOId || commOId === 'admin') {
        throw {gkd: {commOId: '이상한 공동체로의 요청입니다.'}, gkdStatus: {commOId}, where}
      }
      if (!name) throw {gkd: {name: '이름은 주셔야죠 ㅠㅠ'}, gkdStatus: {name}, where}
      if (name === '탈퇴')
        throw {gkd: {name: '탈퇴 클럽은 만들 수 없어요'}, gkdStatus: {name}, where}

      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 생성 가능 클럽 최대치 확인 위한 공동체 뙇!!
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const {clubOIdsArr} = comm
      if (clubOIdsArr.length >= comm.maxClubs) {
        throw {limit: '클럽 생성 제한에 도달했습니다.', gkdStatus: {limit: comm.maxClubs}, where}
      }

      // 클럽 생성 뙇!
      await this.dbHubService.createClub(where, commOId, name)

      // 클럽 OID 을 얻기 위해 뙇!
      const {club} = await this.dbHubService.readClubByName(where, commOId, name)

      // 공동체 클럽 관리 목록에 뙇!
      await this.dbHubService.updateCommLastClubOIDs(where, commOId, club.clubOId)

      // 리턴용 클럽 배열 뙇!
      const {clubsArr} = await this._getClubsArrSortedFromDB(where, commOId)
      return {clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async addUserByMain(jwtPayload: JwtPayloadType, data: AddUserDataType) {
    const where = '/client/main/addUser'
    try {
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, data.commOId)

      const {commOId, id, password} = data

      // 공동체를 뙇!!
      // 최대 유저 넘는지 확인 뙇!!
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      if (!comm) {
        throw {gkd: {commOId: '이런 공동체가 없어요.'}, gkdStatus: {commOId}, where}
      }
      const {maxUsers, users: prevUsers} = comm
      if (maxUsers <= Object.keys(prevUsers).length) {
        throw {gkd: {maxUsers: '최대 유저수에 도달했습니다.'}, gkdStatus: {maxUsers}, where}
      }

      // 유저 생성
      await this.dbHubService.createUser(where, id, password, commOId)

      // uOId 를 가져오기 위한 발버둥
      // create, update 에서는 그 어떠한 것도 리턴받지 말자구용
      const {user} = await this.dbHubService.readUserByIdPassword(where, id, password)

      // 유저를 만들었으면 공동체에 권한도 부여해줘야징.
      await this.dbHubService.updateCommUserAuth(where, commOId, user.uOId, 1)

      const {users} = await this._getUsersFromDB(where, commOId)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getDailyRecordsArr(jwtPayload: JwtPayloadType, memOId: string, range: number) {
    const where = '/client/main/getDailyRecordsArr'
    try {
      // 권한 췍!!
      const {commOId} = (await this.dbHubService.readMemberByMemOId(where, memOId)).member
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 시작일, 종료일 뙇!!
      const start = shiftDateValue(getStartValue(), -range)
      const end = getEndValue()

      // 이 멤버의 특정구간 기록 뙇!!
      const {dailyRecordsArr} = await this.dbHubService.readDailyArrByMemberWithRange(
        where,
        memOId,
        start,
        end
      )

      // 리턴 뙇!!
      return {dailyRecordsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getEntireMembers(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/main/getEntireMembers'
    try {
      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 리턴용 오브젝트들 뙇!!
      const {clubMembersArr, entireMembers, entireMembersArr} = await this._getEMemObjectsFromDB(
        where,
        commOId
      )

      // 리턴 뙇!!
      return {clubMembersArr, entireMembers, entireMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async modifySelf(jwtPayload: JwtPayloadType, data: ModifySelfInfoDataType) {
    const where = '/client/main/modifySelf'
    try {
      const {uOId, id, prevPassword, newPassword} = data
      // 권한 췍!: uOId 의 정보를 쓸 수 있는지
      await this.dbHubService.checkUserDBWrite(jwtPayload, where, uOId)

      // (공동체, 이름) 조합이 중복되는지 체크해야됨
      // 그 때 필요한 commOId
      const {user} = await this.dbHubService.readUserByUOId(where, uOId)
      const {commOId} = user

      // 내 정보 업데이트를 뙇!
      await this.dbHubService.updateUserSelf(where, uOId, id, prevPassword, newPassword)

      // 리턴할 유저 오브젝트를 뙇!
      const {users} = await this._getUsersFromDB(where, commOId)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async modifyUserByMain(jwtPayload: JwtPayloadType, data: SetUserInfoDataType) {
    const where = '/client/main/modifyUser'
    try {
      const {uOId, id, password, authVal} = data
      await this.dbHubService.checkUserDBWrite(jwtPayload, where, uOId)

      if (!uOId) throw {gkd: {uOId: '타겟 UOID 를 잘 설정해 주세요'}, gkdStatus: {uOId}, where}
      // id, password, authVal 은 공란이거나 null 일 수 있다.
      const {user} = await this.dbHubService.readUserByUOId(where, uOId)

      if (!user) throw {gkd: {uOId: '그런 유저는 없어요'}, gkdStatus: {uOId}, where}

      if (user.id === 'test') {
        throw {gkd: {id: '테스트 유저는 수정할 수 없어요'}, gkdStatus: {id}, where}
      }

      const {commOId} = user

      // id 가 중복이거나 하면 updateUser 가 안되어야 한다.
      // 이게 안되면 updateCommUserAuth 도 안되어야 한다.
      await this.dbHubService.updateUser(where, commOId, uOId, id, password, authVal)
      await this.dbHubService.updateCommUserAuth(where, commOId, uOId, authVal)

      const {users} = await this._getUsersFromDB(where, commOId)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setMemberInfo(jwtPayload: JwtPayloadType, data: SetMemberInfoDataType) {
    const where = '/client/main/setMemberInfo'
    try {
      // 권한 췍!!
      const {commOId, memOId, name, batterPower, pitcherPower, clubOId, comment} = data
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 이름 중복 췍!!
      if (name) {
        const {member} = await this.dbHubService.readMemberByClubOIdName(where, clubOId, name)
        if (member) throw {gkd: {exist: '이미 존재하는 멤버입니다.'}, gkdStatus: {name}, where}
      }

      // 수정 뙇!!
      await this.dbHubService.updateMemberInfo(
        where,
        memOId,
        name,
        batterPower,
        pitcherPower,
        clubOId,
        comment
      )

      // 리턴용 오브젝트들 뙇!!. 중복코드는 그대로 호출한다.
      const {clubMembersArr, entireMembers, entireMembersArr} = await this._getEMemObjectsFromDB(
        where,
        commOId
      )
      return {clubMembersArr, entireMembers, entireMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA3: EMembers Area
  async getMembersByMembers(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/members/getMembers'
    try {
      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 필요한 정보 뙇!!
      const {clubOIdsArr} = (await this.dbHubService.readCommByCommOId(where, commOId)).comm

      // 리턴용 eMembersMatrix 뙇!!
      const eMembersMatrix: EMemberType[][] = []
      for (let clubIdx = 1; clubIdx < clubOIdsArr.length; clubIdx++) {
        const clubOId = clubOIdsArr[clubIdx]
        const colIdx = clubIdx - 1
        const {eMembersArr} = await this.dbHubService.readEMembersArrByClubOId(
          where,
          clubOId,
          colIdx
        )
        eMembersArr.sort((a, b) => {
          const sumA = (a.batterPower || 0) + (a.pitcherPower || 0)
          const sumB = (b.batterPower || 0) + (b.pitcherPower || 0)
          return sumB - sumA
        })

        eMembersMatrix.push(eMembersArr)
      }

      // 후보군 클럽 뙇!!
      for (let clubIdx = 0; clubIdx < clubOIdsArr.length; clubIdx++) {
        if (clubIdx > 0) break
        const clubOId = clubOIdsArr[clubIdx]
        const colIdx = clubOIdsArr.length - 1
        const {eMembersArr} = await this.dbHubService.readEMembersArrByClubOId(
          where,
          clubOId,
          colIdx
        )
        eMembersArr.sort((a, b) => {
          const sumA = (a.batterPower || 0) + (a.pitcherPower || 0)
          const sumB = (b.batterPower || 0) + (b.pitcherPower || 0)
          return sumB - sumA
        })

        eMembersMatrix.push(eMembersArr)
      }

      return {eMembersMatrix}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * EMembers DB 에 저장된걸 불러온다. \
   * members 에 저장된걸 불러오는게 아니다.
   */
  async loadMatrix(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/client/members/loadMatrix'
    try {
      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)

      // 배열 크기 뙇!!
      const {clubOIdsArr} = (await this.dbHubService.readCommByCommOId(where, commOId)).comm
      const numClubs = clubOIdsArr.length

      // 리턴용 matrix 뙇!!
      const eMembersMatrix: EMemberType[][] = []
      for (let colIdx = 0; colIdx < numClubs; colIdx++) {
        const {eMembersArr} = await this.dbHubService.readEMemArr(where, commOId, colIdx)
        if (eMembersArr) {
          eMembersMatrix.push(eMembersArr)
        } // BLANK LINE COMMENT:
        else {
          eMembersMatrix.push([])
        }
      }

      // 리턴 뙇!!
      return {eMembersMatrix}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async saveMatrix(jwtPayload: JwtPayloadType, data: SetEMemMatrixDataType) {
    const where = '/client/members/saveMatrix'
    try {
      // 권한 췍!!
      const {commOId, eMembersMatrix} = data
      await this.dbHubService.checkCommMaster(jwtPayload, where, commOId)

      const {clubOIdsArr} = (await this.dbHubService.readCommByCommOId(where, commOId)).comm

      // 저장 뙇!!
      for (let colIdx = 0; colIdx < eMembersMatrix.length; colIdx++) {
        const eMembersArr = eMembersMatrix[colIdx]
        const {eMembersArr: isExist} = await this.dbHubService.readEMemArr(where, commOId, colIdx)
        const clubOId = clubOIdsArr[(colIdx + 1) % eMembersMatrix.length]

        if (isExist !== null) {
          await this.dbHubService.updateEMemArr(where, commOId, clubOId, colIdx, eMembersArr)
        } // BLANK LINE COMMENT:
        else {
          await this.dbHubService.createEMemArr(where, commOId, clubOId, colIdx, eMembersArr)
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA4: Club Area
  /**
   * 멤버 추가 요청을 처리한다
   * - 미중복시
   *    - 멤버추가를 하고 members, legacyMembersArr: null
   * - 중복시
   *    - 멤버추가 X, members: null, legacyMembersArr 리턴
   */
  async addMemberReqByClub(jwtPayload: JwtPayloadType, data: AddMemberDataType) {
    const where = '/client/club/addMemberReqByClub'
    try {
      let debug = 0
      const {name, commOId, clubOId, batterPower, pitcherPower} = data
      let isEntire = false // 코드 닫기용 변수
      // 권한 췍!!
      await this.dbHubService.checkCommDBWrite(jwtPayload, where, commOId)
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 같은 클럽 중복 췍! 에러 뙇!
      const {member: isSameClub} = await this.dbHubService.readMemberByClubOIdName(
        where,
        clubOId,
        name
      )
      if (isSameClub)
        throw {gkd: {name: '이미 같은 클럽에 존재합니다.'}, gkdStatus: {clubOId, name}, where}

      // 부 클럽 중복 췍! 에러 뙇!
      const {membersArr: isOtherClub} = await this.dbHubService.readMembersArrNoLegacy(
        where,
        commOId,
        name
      )
      if (isOtherClub && isOtherClub.length > 0)
        throw {
          gkd: {commOId: '다른 부클럽이나 후보군 클럽에 존재합니다.'},
          gkdStatus: {name},
          where
        }

      // 레거시 췍! 있다면 레거시 리스트 뙇!
      const {membersArr: legacyMembersArr} = await this.dbHubService.readMembersArrOnlyLegacy(
        where,
        commOId,
        name
      )
      if (legacyMembersArr && legacyMembersArr.length > 0) {
        return {members: null, legacyMembersArr}
      }

      // 멤버를 뙇!
      await this.dbHubService.createMember(where, commOId, clubOId, name, batterPower, pitcherPower)

      // members 를 뙇!
      const {members} = await this._getMembersFromDB(where, clubOId)

      // 새로 만든 멤버의 memOId 를 뙇!!
      const memOId = Object.keys(members).filter(_memOId => members[_memOId].name === name)[0]

      // 전체 멤버 리스트에 뙇!!
      if (!isEntire) {
        const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
        const {clubOIdsArr} = comm
        const clubIdx = clubOIdsArr.findIndex(_clubOId => _clubOId === clubOId)

        // 클럽이 멤버관리 목록에 없는 경우
        if (clubIdx === -1) {
          throw {
            gkd: {clubOId: `해당 클럽이 comm의 멤버 관리 클럽에 없어요`},
            gkdStatus: {commOId, clubOId},
            where
          }
        }

        const colIdx = (clubIdx + clubOIdsArr.length - 1) % clubOIdsArr.length

        const {eMembersArr} = await this.dbHubService.readEMemArr(where, commOId, colIdx)
        const member = members[memOId]
        const {memberComment, position} = member
        const newEMember: EMemberType = {
          batterPower,
          clubOId,
          colIdx,
          commOId,
          memberComment,
          memOId,
          name,
          position,
          pitcherPower
        }

        // eMembersArr 가 [] 를 받아도 제대로 안 돌아가길래 이렇게 했다.
        if (!eMembersArr) {
          await this.dbHubService.updateEMemArr(where, commOId, clubOId, colIdx, [newEMember])
        } // BLANK LINE COMMENT:
        else {
          eMembersArr.push(newEMember)
          await this.dbHubService.updateEMemArr(where, commOId, clubOId, colIdx, eMembersArr)
        }
      }

      return {members, legacyMembersArr: null}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async changeMemClub(jwtPayload: JwtPayloadType, data: ChangeMemClubDataType) {
    const where = '/client/club/changeMemClub'
    try {
      let isEntire = false // 코드 접기용 변수. true 면 전체멤버 갱신 안함.

      // 권한 췍!
      const {memOId, clubOId} = data
      await this.dbHubService.checkMemDBWrite(jwtPayload, where, memOId)
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 이전 클럽 OID 뙇!
      const {member} = await this.dbHubService.readMemberByMemOId(where, memOId)
      if (!member) throw {gkd: {memOId: '멤버가 DB 에 없어요'}, gkdStatus: {memOId}, where}
      const {clubOId: prevClubOId} = member

      // 멤버 정보 수정 뙇!
      await this.dbHubService.updateMembersClub(where, memOId, clubOId)

      // 리턴용 members 뙇!
      const {members} = await this._getMembersFromDB(where, prevClubOId)

      // 전체 멤버 리스트 갱신 뙇!!
      if (!isEntire) {
        const {commOId} = member
        const {clubOIdsArr} = (await this.dbHubService.readCommByCommOId(where, commOId)).comm

        const lenArr = clubOIdsArr.length

        // 모든 클럽에 대하여 해당 멤버를 일단 뺀다.
        // 원래 있던 클럽이 아니어도 수정하는 과정에서 해당 멤버가 존재할 수 있다.
        for (let clubIdx = 0; clubIdx < lenArr; clubIdx++) {
          const clubOId0 = clubOIdsArr[clubIdx]
          const colIdx = (clubIdx - 1 + lenArr) % lenArr
          const {eMembersArr} = await this.dbHubService.readEMemArr(where, commOId, colIdx)

          // 모든 클럽들에 대하여 해당 멤버를 일단 뺀다.
          // 원래 클럽이 아닌 클럽에도 있을 수 있다.
          // 따라서 모든 클럽에 대해서 이 작업을 해야한다.
          if (!eMembersArr) continue
          const newArr = eMembersArr.filter(mem => mem.memOId !== memOId)
          await this.dbHubService.updateEMemArr(where, commOId, clubOId0, colIdx, newArr)
        }

        // 옮길 클럽에 뙇!!
        const clubIdx = clubOIdsArr.findIndex(_clubOId => _clubOId === clubOId)
        const colIdx = (clubIdx - 1 + lenArr) % lenArr
        const {eMembersArr} = await this.dbHubService.readEMemArr(where, commOId, colIdx)
        const {batterPower, memberComment, name} = member
        const {pitcherPower, position} = member
        const newEMember: EMemberType = {
          batterPower,
          clubOId,
          colIdx,
          commOId,
          memberComment,
          memOId,
          name,
          position,
          pitcherPower
        }

        // 배열 리턴 받은경우와 아닌경우를 구분해야 한다.
        if (eMembersArr) {
          eMembersArr.push(newEMember)
          await this.dbHubService.updateEMemArr(where, commOId, clubOId, colIdx, eMembersArr)
        } // BLANK LINE COMMENT:
        else {
          await this.dbHubService.updateEMemArr(where, commOId, clubOId, colIdx, [newEMember])
        }
        // End: 전체 멤버 리스트 갱신 뙇!!
      }
      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteClubMember(jwtPayload: JwtPayloadType, clubOId: string, memOId: string) {
    const where = '/client/club/deleteClubMember'
    try {
      let isEntire = false // 코드 닫기용 변수.
      // 권한 췍!!
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)
      await this.dbHubService.checkMemDBWrite(jwtPayload, where, memOId)

      // 다른 클럽의 멤버를 지우려는지 체크 뙇!!
      const {member} = await this.dbHubService.readMemberByMemOId(where, memOId)
      if (member.clubOId !== clubOId)
        throw {gkd: {clubOId: `소속 클럽이 이상합니다.`}, gkdStatus: {memOId, clubOId}, where}

      // 삭제 뙇!!
      await this.dbHubService.deleteMember(where, memOId)

      // 리턴용 members 뙇!!
      const {members} = await this._getMembersFromDB(where, clubOId)

      // 전체 멤버 리스트에서 삭제 뙇!!
      if (!isEntire) {
        const {commOId} = member
        const {clubOIdsArr} = (await this.dbHubService.readCommByCommOId(where, commOId)).comm

        const lenArr = clubOIdsArr.length

        // 수정하는 과정에서 어느 클럽에 있는지 확실치 않다.
        // 모든 클럽 다 뒤져서 지운다.
        for (let clubIdx = 0; clubIdx < lenArr; clubIdx++) {
          const clubOId0 = clubOIdsArr[clubIdx]
          const colIdx = (clubIdx - 1 + lenArr) % lenArr
          const {eMembersArr} = await this.dbHubService.readEMemArr(where, commOId, colIdx)

          if (!eMembersArr) continue
          const newArr = eMembersArr.filter(mem => mem.memOId !== memOId)
          await this.dbHubService.updateEMemArr(where, commOId, clubOId0, colIdx, newArr)
        }
      }

      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async getMemberRecordsArr(jwtPayload: JwtPayloadType, memOId: string, dateRange: number) {
    // 멤버가 DB 에서 지워졌어도 기록은 유지되는 경우가 있다.
    // 지워진 멤버의 memOId 에서도 돌아가야 한다.
    const where = '/client/club/getMemberRecordsArr'
    try {
      // 권한 췍!!
      await this.dbHubService.checkMemDBWrite(jwtPayload, where, memOId)

      // 리턴용 배열 뙇!!
      const start = shiftDateValue(getStartValue(), -dateRange)
      const end = getEndValue()
      const {dailyRecordsArr} = await this.dbHubService.readDailyArrByMemberWithRange(
        where,
        memOId,
        start,
        end
      )

      // 리턴 뙇!!
      return {dailyRecordsArr, end}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getMembersByClub(jwtPayload: JwtPayloadType, clubOId: string) {
    const where = '/client/club/getMembers'
    try {
      await this.dbHubService.checkClubDBRead(jwtPayload, where, clubOId)
      const {members} = await this._getMembersFromDB(where, clubOId)
      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async setCardInfo(jwtPayload: JwtPayloadType, data: SetCardInfoDataType) {
    const where = '/client/club/setCardInfo'
    try {
      // 권한 췍!!
      const {memOId, posIdx, name, skillIdxs, skillLevels} = data
      await this.dbHubService.checkMemDBWrite(jwtPayload, where, memOId)

      // 이름 길이 췍!!
      if (name.length > 6) throw {gkd: {name: `이름이 너무 길어요`}, gkdStatus: {name}, where}

      // 포지션 값 췍!!
      if (posIdx < 0 || posIdx > 24)
        throw {gkd: {posIdx: `포지션이 이상해요`}, gkdStatus: {posIdx}, where}

      // 스킬 인덱스 배열 길이 췍!!
      if (skillIdxs.length !== 3)
        throw {
          gkd: {skillIdx: `스킬 갯수가 너무 많아요`},
          gkdStatus: {length: skillIdxs.length},
          where
        }

      // 스킬 레벨 배열 길이 췍!!
      if (skillLevels.length !== 3)
        throw {
          gkd: {skillLevels: `레벨 갯수가 너무 많아요`},
          gkdStatus: {length: skillLevels.length},
          where
        }

      // 스킬 인덱스 값 췍!! (대포군단, 닥터K 출시까지의 스킬갯수 = 46)
      const [idx0, idx1, idx2] = skillIdxs
      if (idx0 < 0 || idx1 < 0 || idx2 < 0)
        throw {gkd: {skillIdx: `스킬 인덱스가 낮아요`}, gkdStatus: {skillIdxs}, where}
      if (idx0 > 45 || idx1 > 45 || idx2 > 45)
        throw {gkd: {skillIdx: `스킬 인덱스가 높아요`}, gkdStatus: {skillIdxs}, where}

      // 스킬 레벨 값 췍!! (E, D, C, B, A, S)
      const [lv0, lv1, lv2] = skillLevels
      if (lv0 < 0 || lv1 < 0 || lv2 < 0)
        throw {gkd: {skillLevels: `스킬 레벨이 낮아요`}, gkdStatus: {skillLevels}, where}
      if (lv0 > 5 || lv1 > 5 || lv2 > 5)
        throw {gkd: {skillLevels: `스킬 레벨이 높아요`}, gkdStatus: {skillLevels}, where}

      // 카드 수정 뙇!!
      await this.dbHubService.updateMemberCard(where, memOId, posIdx, name, skillIdxs, skillLevels)

      // 리턴용 members 뙇!!
      const {member} = await this.dbHubService.readMemberByMemOId(where, memOId)
      const {clubOId} = member
      const {members} = await this._getMembersFromDB(where, clubOId)
      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setMemComment(jwtPayload: JwtPayloadType, data: SetMemberCommentDataType) {
    const where = '/client/club/setMemComment'
    try {
      // 권한 췍!!
      const {clubOId} = data
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // memOId 에러체크 뙇!!
      const {memOId, memberComment} = data
      if (!memOId)
        throw {gkd: {memOId: '멤버 정보를 제대로 입력해주세요'}, gkdStatus: {memOId}, where}

      // 코멘트만 변화 뙇!!
      await this.dbHubService.updateMemberComment(where, clubOId, memOId, memberComment)

      // members 도 뙇!!
      // 이거 안하면 갱신된게 화면에 제대로 출력이 안된다.
      const {members} = await this._getMembersFromDB(where, clubOId)
      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setMemPos(jwtPayload: JwtPayloadType, data: SetMemberPosDataType) {
    const where = '/client/club/setMemPos'
    try {
      const {memOId, position} = data

      if (position < 0) throw {gkd: {position: `값이 너무 낮아요`}, gkdStatus: {position}, where}
      if (position > 2) throw {gkd: {position: `값이 너무 높아요`}, gkdStatus: {position}, where}

      // 권한 췍!!
      await this.dbHubService.checkMemDBWrite(jwtPayload, where, memOId)

      // 수정 뙇!!
      await this.dbHubService.updateMemPos(where, memOId, position)

      // 리턴용 members 뙇!!
      const {member} = await this.dbHubService.readMemberByMemOId(where, memOId)
      const {clubOId} = member
      const {members} = await this._getMembersFromDB(where, clubOId)
      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setMemPowerByClubMember(jwtPayload: JwtPayloadType, data: SetMemberPowerDataType) {
    const where = '/client/club/setMemPowerByClubMember'
    try {
      const {memOId, name, batterPower, pitcherPower} = data

      if (batterPower && batterPower < 0)
        throw {gkd: {batterPower: '이게 왜 음수야'}, gkdStatus: {batterPower}, where}
      if (pitcherPower && pitcherPower < 0)
        throw {gkd: {pitcherPower: '이게 왜 음수야'}, gkdStatus: {pitcherPower}, where}

      // 권한 췍!!
      await this.dbHubService.checkMemDBWrite(jwtPayload, where, memOId)

      // 이름 중복 체크 뙇!!
      const {member: prevMem} = await this.dbHubService.readMemberByMemOId(where, memOId)
      const {clubOId} = prevMem
      if (clubOId) {
        const {member} = await this.dbHubService.readMemberByClubOIdName(where, clubOId, name)
        // 이름을 바꾸지 않는 경우는 data 에서 name 이 자기 이름이 들어간다.
        // 두 번째 조건을 빼면 이름 빼고 정보를 바꿀때 에러를 투척한다.
        if (member && member.name !== prevMem.name)
          throw {
            gkd: {name: `이미 다른 클럽에 있는 멤버입니다.`},
            gkdStatus: {name, clubOId: member.clubOId},
            where
          }
      }

      // 타자력, 투수력 변경
      await this.dbHubService.updateMemPower(where, memOId, name, batterPower, pitcherPower)

      // 리턴용 members
      const {members} = await this._getMembersFromDB(where, clubOId)

      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA5: Club chat's area
  async clubChat(uOIdsArr: string[], payload: ClubChatType) {
    const where = '/client/chat/clubChat'
    try {
      // 채팅방 DB 갱신 뙇!!
      // 리턴용 챗 뙇!!
      const {clubOId, id, uOId, chatInput: content} = payload
      const {club} = await this.dbHubService.readClubByClubOId(where, clubOId)
      const {commOId, chatRoomOId} = club
      const {chat} = await this.dbHubService.updateChatRoomsChat(
        where,
        chatRoomOId,
        uOId,
        id,
        content
      )

      // 리턴용 안 읽은 인간 리스트 뙇!!
      const {users} = await this._getUsersFromDB(where, commOId)
      uOIdsArr.forEach(uOId => delete users[uOId])
      const unreadUOIdsArr = Array.from(Object.keys(users))

      // 유저별 안 읽은 메시지 갱신 뙇!!
      for (let uOId of unreadUOIdsArr) {
        await this.dbHubService.updateUserUnreadMessages(where, uOId, chatRoomOId)
      }
      return {chat, unreadUOIdsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getChatsArr(jwtPayload: JwtPayloadType, clubOId: string, firstIdx: number) {
    const where = '/client/chat/getChatsArr'
    try {
      // 권한 췍!!
      await this.dbHubService.checkClubDBRead(jwtPayload, where, clubOId)

      // 채팅방 없으면 생성 뙇!!
      // 있던 없던 갱신된 clubsArr 뙇!
      const {club: prevClub} = await this.dbHubService.readClubByClubOId(where, clubOId)
      let chatRoomOId: string = ''
      const {commOId} = prevClub
      if (prevClub.chatRoomOId) {
        chatRoomOId = prevClub.chatRoomOId
      } // BLANK LINE COMMENT:
      else {
        chatRoomOId = (await this.dbHubService.createChatRoom(where, clubOId)).chatRoom.chatRoomOId
        await this.dbHubService.updateClubsChatRoomOId(where, clubOId, chatRoomOId)
      }
      const {clubsArr} = await this._getClubsArrSortedFromDB(where, commOId)

      // 채팅방에서 리턴용 chatsArr 뙇!!
      const {chatRoom} = await this.dbHubService.readChatRoom(where, chatRoomOId)
      const {chatsArr: chatsArrDB} = chatRoom
      const lastIdx = firstIdx > 0 ? firstIdx : chatRoom.length
      const chatsArr = chatsArrDB.slice(Math.max(0, lastIdx - 10), lastIdx)
      return {chatsArr, clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA6: Club document's area
  async getDocument(jwtPayload: JwtPayloadType, clubOId: string) {
    const where = '/client/doc/getDocument'
    let readyLock = null

    try {
      // 권한 췍!!
      await this.dbHubService.checkClubDBRead(jwtPayload, where, clubOId)

      // 락 획득
      readyLock = await this.lockService.readyLock(`doc:${clubOId}`)

      // 문서 읽어서 있으면 리턴! 없으면 생성!
      try {
        const {contents} = await this.dbHubService.readDocContentsByClubOId(where, clubOId)
        return {contents}
        // BLANK LINE COMMENT:
      } catch (errObj) {
        // BLANK LINE COMMENT:
        if (errObj.etc) {
          const {doc} = await this.dbHubService.createDoc(where, clubOId)
          const {contents} = doc
          return {contents}
        } // BLANK LINE COMMENT:
        else {
          throw errObj
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
      // BLANK LINE COMMENT:
    } finally {
      // BLANK LINE COMMENT:
      // 락 해제
      await this.lockService.releaseLock(readyLock)
    }
  }
  async setDocument(jwtPayload: JwtPayloadType, data: SetDocumentDataType) {
    const where = '/client/doc/setDocument'
    try {
      // 권한 췍!!
      const {clubOId, contents: _contents} = data

      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 문서 수정 뙇!!
      await this.dbHubService.updateDocumentWithClubOId(where, clubOId, _contents)

      // 리턴용 오브젝트 뙇!!
      const {contents} = await this.dbHubService.readDocContentsByClubOId(where, clubOId)
      return {contents}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA1: Record Area
  async addNextWeek(jwtPayload: JwtPayloadType, data: AddNextWeekDataType) {
    const where = '/client/record/addNextWeek'
    try {
      // 권한 췍!
      const {clubOId} = data
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 가장 최근 Week 를 췍!
      // - Club DB 랑 WeekRow DB 를 같이 사용해야 한다.
      // - 따라서 여기서 췍을 해야 한다.
      const {club: prevClub} = await this.dbHubService.readClubByClubOId(where, clubOId)
      if (!prevClub) {
        throw {gkd: {clubOId: '이런 클럽이 없어요'}, gkdStatus: {clubOId}, where}
      }
      const prevWeekRowsArr = prevClub.weekRowsArr

      // row 없으면 오늘과 가까운 월요일
      // row 있으면 마지막 일자로부터 +7일
      const start =
        prevWeekRowsArr.length === 0
          ? getStartValue()
          : shiftDateValue(prevWeekRowsArr[prevWeekRowsArr.length - 1].start, 7)
      const end =
        prevWeekRowsArr.length === 0
          ? getEndValue()
          : shiftDateValue(prevWeekRowsArr[prevWeekRowsArr.length - 1].end, 7)

      // 너무 먼 미래를 추가하려고 하면 안돼!!
      if (start > shiftDateValue(getEndValue(), 7))
        throw {gkd: {date: '너무 먼 미래입니다.'}, where}

      // 멤버 정보를 뙇!!
      // row 를 직위순, 전투력 순으로 나열한다.
      const {membersArr} = await this.dbHubService.readMembersArrByClubOId(where, clubOId)
      membersArr.sort((mem1, mem2) => {
        if (mem1.position !== mem2.position) {
          return mem2.position - mem1.position
        } // BLANK LINE COMMENT:
        else {
          return mem2.batterPower + mem2.pitcherPower - (mem1.batterPower + mem1.pitcherPower)
        }
      })
      const rowInfosArr: RecordMemberInfoType[] = membersArr.map(member => {
        const elem: RecordMemberInfoType = {
          memOId: member.memOId,
          name: member.name,
          position: member.position,
          batterPower: member.batterPower,
          pitcherPower: member.pitcherPower
        }
        return elem
      })

      // 새로 만든 WeekRecord 를 가져온다.
      // 얘 OID 를 club 에 넣어야 한다.
      const {weeklyRecord} = await this.dbHubService.createWeeklyRecord(
        where,
        clubOId,
        start,
        end,
        rowInfosArr
      )
      const {weekOId} = weeklyRecord

      // club 에 넣는다.
      await this.dbHubService.updateClubWeekRowsArrPushBack(where, clubOId, weekOId, start, end)

      // member 들의 lastRecorded 를 수정한다.
      await this.dbHubService.updateMembersLastRecorded(where, clubOId, start)

      // 리턴 뙇!!
      const {club} = await this.dbHubService.readClubByClubOId(where, clubOId)
      const {weekRowsArr} = club

      return {weekRowsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async addPrevWeek(jwtPayload: JwtPayloadType, data: AddPrevWeekDataType) {
    const where = '/client/record/addPrevWeek'
    const MAX_CREATE_PREV_WEEK_PER_DAY = 3

    try {
      // 권한 췍!!
      const {clubOId} = data
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 클럽을 뙇!!
      const {club} = await this.dbHubService.readClubByClubOId(where, clubOId)

      // 이전 주차 무한 생성 방지 뙇!!
      const todayValue = getTodayValue()
      const ret = await this.dbHubService.readClubCreatePrevLimit(where, clubOId)
      const {lastAddPrevWeekDate: lastDate, numOfAddedPrevWeek: numAdded} = ret

      if (todayValue > lastDate) {
        await this.dbHubService.updateClubCreatePrevLimit(where, clubOId, todayValue, 1)
      } // BLANK LINE COMMENT:
      else if (numAdded < MAX_CREATE_PREV_WEEK_PER_DAY) {
        await this.dbHubService.updateClubCreatePrevLimit(where, clubOId, todayValue, numAdded + 1)
      } // BLANK LINE COMMENT:
      else {
        throw {
          gkd: {limit: '오늘은 더 만드실 수 없습니다.'},
          gkdStatus: {limit: MAX_CREATE_PREV_WEEK_PER_DAY},
          where
        }
      }

      // 맨 앞 주차 정보 & 행 멤버 정보 뙇!!
      const {weekRowsArr: prevRowsArr} = club
      const {start: firstStart, end: firstEnd, weekOId: firstWeekOId} = prevRowsArr[0]

      const {weeklyRecord: firstWeeklyRecord} = await this.dbHubService.readWeeklyRecord(
        where,
        firstWeekOId
      )
      const firstMemInfo = firstWeeklyRecord.rowInfo.membersInfo

      const start = shiftDateValue(firstStart, -7)
      const end = shiftDateValue(firstEnd, -7)

      // 정보 토대로 새로운 주차 뙇!!
      const {weeklyRecord} = await this.dbHubService.createWeeklyRecord(
        where,
        clubOId,
        start,
        end,
        firstMemInfo
      )

      // club 의 weekRowsArr 수정 뙇!!
      const {weekOId} = weeklyRecord
      await this.dbHubService.updateClubWeekRowsArrPushFront(where, clubOId, weekOId, start, end)

      // 리턴 뙇!!
      const {weekRowsArr} = (await this.dbHubService.readClubByClubOId(where, clubOId)).club
      return {weekRowsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async addRowMember(jwtPayload: JwtPayloadType, data: AddRowMemberDataType) {
    const where = '/client/record/addRowMember'
    try {
      const {weekOId, position, name, batterPower, pitcherPower} = data

      // 권한 췍!!
      await this.dbHubService.checkWeeklyDBWrite(jwtPayload, where, weekOId)

      // DB 에 존재하는지 췍!!
      const {weeklyRecord: prev} = await this.dbHubService.readWeeklyRecord(where, weekOId)
      if (!prev) throw {gkd: {weekOId: '주차가 DB 에서 삭제되었어요'}, gkdStatus: {weekOId}, where}

      // 중복 췍!!
      if (prev.rowInfo.membersInfo) {
        for (let memInfo of prev.rowInfo.membersInfo) {
          if (memInfo.name === name) {
            throw {gkd: {name: '겹친 이름이 왜 있을까'}, gkdStatus: {name}, where}
          }
        }
      }

      // memOId 를 뙇!!
      const {weeklyRecord: _week} = await this.dbHubService.readWeeklyRecord(where, weekOId)
      const {clubOId} = _week
      const {member} = await this.dbHubService.readMemberByClubOIdName(where, clubOId, name)

      const memOId = (member && member.memOId) || ''

      // 생성 및 row 에 추가 뙇!
      await this.dbHubService.createWeeklyMember(
        where,
        weekOId,
        position,
        name,
        batterPower,
        pitcherPower,
        memOId
      )

      // 리턴용 weeklyRecord 뙇!!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)

      // 리턴용 recordsArr 뙇!!
      const {start, end} = weeklyRecord
      const {recordsArr} = await this.dbHubService.readDailyArrByWeeklyInfo(
        where,
        weekOId,
        start,
        end
      )

      return {recordsArr, weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteRowMember(jwtPayload: JwtPayloadType, data: DeleteRowMemDataType) {
    const where = '/client/record/deleteRowMember'
    try {
      const {weekOId, name} = data
      // 권한 췍!!
      await this.dbHubService.checkWeeklyDBWrite(jwtPayload, where, weekOId)

      // row 삭제 뙇!!
      await this.dbHubService.deleteWeeklyRowMember(where, weekOId, name)

      // 리턴용 weeklyRecord 뙇!!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)

      // 기록들 삭제 뙇!
      const {start, end, clubOId} = weeklyRecord
      await this.dbHubService.deleteDailyRecords(where, clubOId, name, start, end)

      // 리턴용 recordsArr 뙇!!
      const {recordsArr} = await this.dbHubService.readDailyArrByWeeklyInfo(
        where,
        clubOId,
        start,
        end
      )

      return {recordsArr, weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteWeekRow(jwtPayload: JwtPayloadType, data: DeleteWeekRowDataType) {
    const where = '/client/record/deleteWeekRow'
    try {
      // 권한 췍!!
      const {weekOId, clubOId} = data
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 읽기용 데이터 뙇!!
      const {club} = await this.dbHubService.readClubByClubOId(where, clubOId)
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)

      // 맨 앞이나 뒤인지 췍!!
      const idx = findWeekRowIdx(club.weekRowsArr, weekOId)

      if (idx === null)
        throw {gkd: {idx: '이미 삭제가 되었나봅니다.'}, gkdStatus: {clubOId, weekOId}, where}
      if (idx !== 0 && idx !== club.weekRowsArr.length - 1) {
        throw {
          gkd: {idx2: '맨 앞이나 맨 뒤만 삭제가 가능해요'},
          gkdStatus: {weekRowsArr: club.weekRowsArr, weekOId},
          where
        }
      }

      // 클럽 수정 뙇!!
      await this.dbHubService.updateClubWeekRowsArrPop(where, clubOId, idx)
      const weekRowsArr = club.weekRowsArr.filter((val, _idx) => _idx !== idx)

      // 주간테이블 삭제 뙇!!
      await this.dbHubService.deleteWeeklyRecord(where, weekOId)

      // 주간 개인 기록 삭제 뙇!!
      const {start, end} = weeklyRecord
      await this.dbHubService.deleteDailyRecordsClub(where, clubOId, start, end)

      // 리턴 뙇!!
      return {weekRowsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async getWeeklyRecord(jwtPayload: JwtPayloadType, weekOId: string) {
    const where = '/client/record/getWeeklyRecord'
    try {
      // 권한 췍!
      await this.dbHubService.checkWeeklyDBRead(jwtPayload, where, weekOId)

      // 주간 테이블 뙇!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)

      const {start, end, clubOId} = weeklyRecord

      // 멤버별 기록을 1차원 배열로 뙇!
      const {recordsArr} = await this.dbHubService.readDailyArrByWeeklyInfo(
        where,
        clubOId,
        start,
        end
      )

      return {recordsArr, weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getWeekRowsArr(jwtPayload: JwtPayloadType, clubOId: string) {
    const where = '/client/record/getWeekRowsArr'
    try {
      // 권한 췍!
      await this.dbHubService.checkClubDBRead(jwtPayload, where, clubOId)

      // Row 를 읽어오는데... 어디서 읽어오지...?
      const {club} = await this.dbHubService.readClubByClubOId(where, clubOId)
      const {weekRowsArr} = club
      return {weekRowsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 일간 코멘트를 수정하는 곳이다.
   */
  async setComments(jwtPayload: JwtPayloadType, data: SetCommentDataType) {
    const where = '/client/record/setComments'
    try {
      const {weekOId, dayIdx, comments} = data

      // 권한 췍!
      await this.dbHubService.checkWeeklyDBWrite(jwtPayload, where, weekOId)

      // 코멘트 변경 뙇!
      await this.dbHubService.updateWeeklyColComments(where, weekOId, dayIdx, comments)

      // 리턴용 weeklyRecord 뙇!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)
      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setRowMember(jwtPayload: JwtPayloadType, data: SetRowMemberDataType) {
    const where = '/client/record/setRowMember'
    try {
      const {weekOId, prevName, position, name, batterPower, pitcherPower, memOId} = data

      // 권한 췍!
      await this.dbHubService.checkWeeklyDBWrite(jwtPayload, where, weekOId)

      // 입력값 췍!!
      if (position < 0 || position > 2)
        throw {gkd: {position: `포지션이 이상해요`}, gkdStatus: {position}, where}

      // 정보 업데이트 뙇!
      await this.dbHubService.updateWeeklyRowMember(
        where,
        weekOId,
        prevName,
        position,
        name,
        batterPower,
        pitcherPower,
        memOId
      )

      // 기록 업데이트 뙇!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)
      const {start, end, clubOId} = weeklyRecord
      await this.dbHubService.updateRecordName(where, clubOId, start, end, prevName, name)

      // 이름 바뀌어서 갱신된 기록들 뙇!
      const {recordsArr} = await this.dbHubService.readDailyArrByWeeklyInfo(
        where,
        clubOId,
        start,
        end
      )

      return {recordsArr, weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setTHead(jwtPayload: JwtPayloadType, data: SetTHeadDataType) {
    const where = '/client/record/setTHead'
    try {
      const {clubOId, weekOId, dateIdx, enemyName, pitchOrder, order} = data
      // 권한 췍!!
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // THead 업데이트
      await this.dbHubService.updateWeeklyTHead(
        where,
        weekOId,
        dateIdx,
        enemyName,
        pitchOrder,
        order
      )

      // 리턴용 WeeklyRecord 뙇!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)
      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setWeeklyComment(jwtPayload: JwtPayloadType, data: SetWeeklyCommentDataType) {
    const where = '/client/record/setWeeklyComment'
    try {
      // 권한 췍!!
      const {weekOId, comment} = data
      await this.dbHubService.checkWeeklyDBRead(jwtPayload, where, weekOId)

      // 코멘트 입력 뙇!!
      await this.dbHubService.updateWeeklyComments(where, weekOId, comment)

      // 리턴용 weeklyRecord 뙇!!
      const {weeklyRecord} = await this.dbHubService.readWeeklyRecord(where, weekOId)
      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async submitRecord(jwtPayload: JwtPayloadType, data: SetDailyRecordType) {
    const where = '/client/record/submitRecord'
    try {
      const {clubOId, date, name, condError, results, comment, start, end, memOId} = data

      // 권한 췍!!
      await this.dbHubService.checkClubDBWrite(jwtPayload, where, clubOId)

      // 기록 쓰기
      await this.dbHubService.createOrUpdateRecord(
        where,
        clubOId,
        date,
        name,
        condError,
        results,
        comment,
        memOId
      )

      // 배열 리턴
      const {recordsArr} = await this.dbHubService.readDailyArrByWeeklyInfo(
        where,
        clubOId,
        start,
        end
      )
      return {recordsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: Private function area
  /**
   * 권한췍은 알아서 하자
   */
  private async _getClubsArrSortedFromDB(where: string, commOId: string) {
    where = where + '/_getClubsArrSortedFromDB'
    try {
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const {clubOIdsArr} = comm

      const {clubsArr} = await this.dbHubService.readClubsArrByClubOIdsArr(where, clubOIdsArr)
      return {clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _getEMemObjectsFromDB(where: string, commOId: string) {
    where = where + '/_getEMemObjectsFromDB'
    try {
      // 공동체 뙇!!
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const {clubOIdsArr} = comm

      // 리턴용 entireMembers 뙇!!
      const entireMembers: {[memOId: string]: MemberInfoType} = {}
      const entireMembersArr: MemberInfoType[] = []
      const clubMembersArr: MemberInfoType[][] = []

      // 후보군 클럽 멤버는 여기로 뙇!!
      const tempMembersArr: MemberInfoType[] = []

      // Promise.all 쓰면 clubOId 순서가 보장되지 않는다.
      let clubIdx = 0
      for (let clubOId of clubOIdsArr) {
        const tempArr: MemberInfoType[] = []

        const {membersArr} = await this.dbHubService.readMembersArrByClubOId(where, clubOId)
        membersArr.forEach((member, memIdx) => {
          entireMembers[member.memOId] = member
          // 후보군 클럽인지 아닌지 확인 뙇!!
          if (clubIdx == 0) {
            tempMembersArr.push(member)
          } // BLANK LINE COMMENT:
          else {
            entireMembersArr.push(member)
          }
          tempArr.push(member)
        })

        clubMembersArr.push(tempArr)
        clubIdx = clubIdx + 1
      }
      // 후보군 클럽 멤버는 배열의 마지막에 뙇!!
      tempMembersArr.forEach((member, memIdx) => {
        entireMembersArr.push(member)
      })

      // 리턴 뙇!!
      return {clubMembersArr, entireMembers, entireMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _getMembersFromDB(where: string, clubOId: string) {
    where = where + '/_getMembersFromDB'
    try {
      const {membersArr} = await this.dbHubService.readMembersArrByClubOId(where, clubOId)
      const members: {[memOId: string]: MemberInfoType} = {}
      membersArr.map(member => (members[member.memOId] = member))
      return {members}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * UserDB 에는 보안상의 이유로 AuthVal 을 포함시키지 않았다.
   * 이것이 포함된 결과를 받으려면 이렇게 해야한다.
   */
  private async _getUsersFromDB(where: string, commOId: string) {
    try {
      const {usersArr} = await this.dbHubService.readUsersArrByCommOId(where, commOId)
      const uOIdsArr = usersArr.map(user => user.uOId)
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)

      const users: {[uOId: string]: UserInfoAuthType} = {}
      uOIdsArr.map((uOId, uOIdIndex) => {
        const elem: UserInfoAuthType = {
          uOId: uOId,
          id: usersArr[uOIdIndex].id,
          commOId: usersArr[uOIdIndex].commOId,
          authVal: comm.users[uOId],
          unreadMessages: usersArr[uOIdIndex].unreadMessages
        }
        users[uOId] = elem
      })
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
