import {Injectable} from '@nestjs/common'
import {DatabaseHubService} from '../../databaseHub/databaseHub.service'
import {
  AddClubDataType,
  AddCommDataType,
  AddUserDataType,
  ChangeCommNameDataType,
  ClubInfoType,
  CommsRowType,
  JwtPayloadType,
  LogInDataType,
  SetCommAuthDataType,
  SetCommMaxClubsDataType,
  SetCommMaxUsersDataType,
  SignUpDataType,
  UserInfoAuthType
} from 'src/common/types'

/**
 * 권한체크 이 모듈에서 한다.
 * 몇몇 함수는 권한체크가 없을 수 있다.
 * - 로그인 같은건 권한체크 하면 안되지...
 */
@Injectable()
export class AdminPortService {
  constructor(private readonly dbHubService: DatabaseHubService) {}

  // AREA1: /admin
  async logIn(data: LogInDataType) {
    const where = '/admin/logIn'
    try {
      const {id, password} = data
      // 인자 에러 처리
      if (!id) throw {gkd: {id: 'ID 가 왜 비어있어?'}, gkdStatus: {}, where}
      if (!password) throw {gkd: {password: '비번이 왜 비어있어?'}, gkdStatus: {}, where}

      const {user} = await this.dbHubService.readUserByIdPassword(where, id, password)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async gkdButton() {
    const where = '/admin/gkdButton'
    try {
      const {comm} = await this.dbHubService.readCommByName(where, 'Focus')
      const {clubOIdsArr, commOId} = comm
      for (let colIdx = 0; colIdx < 6; colIdx++) {
        const {eMembersArr} = await this.dbHubService.readEMemArr(where, commOId, colIdx)
        eMembersArr.forEach((member, memIdx) => {
          if (member.clubOId === clubOIdsArr[2]) {
            eMembersArr[memIdx].colIdx = 2
          } // BLANK LINE COMMENT:
          else if (member.clubOId === clubOIdsArr[3]) {
            eMembersArr[memIdx].colIdx = 3
          } // BLANK LINE COMMENT:
          else if (member.clubOId === clubOIdsArr[4]) {
            eMembersArr[memIdx].colIdx = 4
          } // BLANK LINE COMMENT:
        })

        await this.dbHubService.updateEMemArr(where, commOId, clubOIdsArr[0], colIdx, eMembersArr)
      }

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async signUp(data: SignUpDataType) {
    const where = '/admin/signUp'
    try {
      const {id, password} = data
      if (!id)
        throw {gkd: {id: 'Server: 회원가입할때 누가 ID 를 입력 안하나'}, gkdStatus: {}, where}
      if (!password)
        throw {gkd: {password: 'Server: 비밀번호 없이 회원 만드려고?'}, gkdStatus: {}, where}

      await this.dbHubService.createUser(where, id, password)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: /admin/community
  async addBanClub(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const where = '/admin/community/addBanClub'
    try {
      const {commOId, name} = data
      if (!commOId || commOId === 'admin')
        throw {gkd: {commOId: '잘못된 공동체에 대한 요청입니다.'}, gkdStatus: {commOId}, where}
      if (name !== '탈퇴')
        throw {gkd: {name: '클럽명이 탈퇴여야 합니다. '}, gkdStatus: {name}, where}

      // 공동체 없거나 관리자면 throw 한다.
      await this.dbHubService.readCommByCommOId(where, commOId)

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

      // 만든다.
      await this.dbHubService.createClub(where, commOId, name)

      // 클럽 OID 을 얻기 위해 뙇!
      const {club} = await this.dbHubService.readClubByName(where, commOId, name)

      // 공동체에 BanCOId 를 추가한다.
      await this.dbHubService.updateCommBCOId(where, commOId, club.clubOId)

      // 리턴용 공동체 오브젝트 뙇!!
      const {comms} = await this.dbHubService.readComms(where)
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      throw errObj
    }
  }
  async addClub(jwtPayload: JwtPayloadType, data: AddClubDataType) {
    const where = '/admin/community/addClub'
    try {
      const {commOId, name} = data

      if (!commOId || commOId === 'admin')
        throw {gkd: {commOId: '잘못된 공동체에 대한 요청입니다.'}, gkdStatus: {commOId}, where}
      if (!name) throw {gkd: {name: '잘못된 클럽명에 대한 요청입니다. '}, gkdStatus: {name}, where}
      if (name === '탈퇴')
        throw {gkd: {name: '탈퇴 클럽은 여기서 만들지 않습니다. '}, gkdStatus: {name}, where}

      // 공동체 없거나 관리자면 throw 한다.
      await this.dbHubService.readCommByCommOId(where, commOId)

      // 만든다.
      await this.dbHubService.createClub(where, commOId, name)

      // 생성된 클럽을 뙇!!
      const {club} = await this.dbHubService.readClubByName(where, commOId, name)

      // 공동체에 클럽을 뙇!!
      await this.dbHubService.updateCommLastClubOIDs(where, commOId, club.clubOId)

      // 클럽 배열을 뙇!!
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const {clubOIdsArr} = comm
      const {clubsArr} = await this.dbHubService.readClubsArrByClubOIdsArr(where, clubOIdsArr)

      // 공동체의 클럽 리스트도 수정해야 한다.
      await this.dbHubService.updateCommCOIdsByCOIDs(where, commOId, clubOIdsArr)

      return {clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async addComm(jwtPayload: JwtPayloadType, data: AddCommDataType) {
    const where = '/admin/community/addComm'
    try {
      const {name} = data
      if (!name)
        throw {gkd: {name: '추가할 공동체의 이름을 서버로 전달해주세요.'}, gkdStatus: {name}, where}
      await this.dbHubService.createCommunity(where, name)
      const {comms} = await this.dbHubService.readComms(where)
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async addUserByCommService(jwtPayload: JwtPayloadType, data: AddUserDataType) {
    const where = '/admin/community/addUserByCommService'
    try {
      const {id, password, commOId} = data
      if (!id) throw {gkd: {id: '유저를 추가하는데 ID 가 비어?'}, gkdStatus: {}, where}
      if (!password) throw {gkd: {password: '유저를 추가하는데 비번이 비어?'}, gkdStatus: {}, where}
      if (!commOId)
        throw {gkd: {commOId: '어디에 유저를 추가할지는 전달해야지'}, gkdStatus: {}, where}

      await this.dbHubService.createUser(where, id, password, commOId)
      const {commUsersArr} = await this._getCommUsersAuthArr(where, commOId)

      return {commUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async changeCommName(jwtPayload: JwtPayloadType, data: ChangeCommNameDataType) {
    const where = '/admin/community/changeCommName'
    try {
      const {commOId, name} = data

      // 이름 Null 이면 안됨
      if (!name) throw {gkd: {name: '이름을 제대로 입력해주세요.'}, gkdStatus: {}, where}

      // 중복 췍!!
      const {comm: isExist} = await this.dbHubService.readCommByName(where, name)
      if (isExist) throw {gkd: {name: `이름이 중복됬어요`}, gkdStatus: {}, where}

      await this.dbHubService.updateCommName(where, commOId, name)
      const {comms} = await this.dbHubService.readComms(where)
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteClubFromAdmin(jwtPayload: JwtPayloadType, commOId: string, clubOId: string) {
    const where = '/admin/community/deleteClubFromAdmin'
    // 후보군 클럽을 먼저 제거하는지 여부...
    try {
      // 클럽을 일단 변수에 저장한다.
      const {club} = await this.dbHubService.readClubByClubOId(where, clubOId)

      // 클럽 자체를 삭제한다.
      await this.dbHubService.deleteClubByClubOId(where, clubOId)

      // 클럽의 멤버들을 삭제한다
      await this.dbHubService.deleteMembersByClubOId(where, clubOId)

      // 클럽의 대전 기록을 삭제한다.
      const {weekRowsArr} = club
      await Promise.all(
        weekRowsArr.map(
          async (weekRow, idx) => await this.dbHubService.deleteWeeklyRecord(where, weekRow.weekOId)
        )
      )

      // 클럽의 회의록을 삭제한다.
      await this.dbHubService.deleteDocByClubOId(where, clubOId)

      // 클럽의 채팅내역을 삭제한다.
      await this.dbHubService.deleteChatroomByClubOId(where, clubOId)

      // 모든 유저에게서 해당 클럽의 안 읽은 채팅갯수를 삭제한다.
      const {usersArr} = await this.dbHubService.readUsersArrByCommOId(where, commOId)
      const {chatRoomOId} = club
      await Promise.all(
        usersArr.map(
          async (user, idx) =>
            await this.dbHubService.deleteUsersUnreadMessageCnt(where, user.uOId, chatRoomOId)
        )
      )

      // 공동체에서 클럽을 삭제한다.
      await this.dbHubService.deleteClubInCommunity(where, commOId, clubOId)

      // 전체 멤버 리스트에서 해당 클럽을 삭제한다.
      await this.dbHubService.deleteEMemArr(where, commOId, clubOId)

      // 전체 멤버 리스트를 갱신한다.
      const {clubOIdsArr} = (await this.dbHubService.readCommByCommOId(where, commOId)).comm
      const clubLen = clubOIdsArr.length
      for (let clubIdx = 0; clubIdx < clubLen; clubIdx++) {
        const clubOId = clubOIdsArr[clubIdx]
        const colIdx = (clubIdx + clubLen - 1) % clubLen
        await this.dbHubService.updateEMemArrColIdxByClubOId(where, clubOId, colIdx)
      }

      // 리턴용 공동체 오브젝트를 받는다.
      // 관리자 사이트에 넘길거라서 오브젝트로 해야한다.
      const {comms} = await this.dbHubService.readComms(where)

      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteUserFromAdmin(jwtPayload: JwtPayloadType, commOId: string, uOId: string) {
    const where = '/admin/community/deleteUserFromAdmin'
    try {
      // 유저를 일단 변수에 저장한다.
      const {user} = await this.dbHubService.readUserByUOId(where, uOId)
      if (!user) {
        throw {gkd: {user: '유저가 DB에 존재하지 않아요'}, gkdStatus: {uOId}, where}
      }

      // 유저를 삭제 뙇!!
      await this.dbHubService.deleteUserByUOId(where, uOId)

      // 공동체에서 유저를 삭제 뙇!!
      await this.dbHubService.deleteCommUserAuthVal(where, commOId, uOId)

      // 리턴용 오브젝트 뙇!!
      const {comms} = await this.dbHubService.readComms(where)
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async getClubsArr(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/admin/community/getClubsArr'
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
  async getComms(jwtPayload: JwtPayloadType) {
    const where = '/admin/community/getComms'
    try {
      const {comms} = await this.dbHubService.readComms(where)
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getCommUsersArr(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/admin/community/getCommUsersArr'
    try {
      const {commUsersArr} = await this._getCommUsersAuthArr(where, commOId)
      return {commUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async setCommMaxClubs(jwtPayload: JwtPayloadType, data: SetCommMaxClubsDataType) {
    const where = '/admin/community/setCommMaxClubs'
    try {
      const {commOId, maxClubs} = data

      await this.dbHubService.updateCommMaxClubs(where, commOId, maxClubs)
      const {comms} = await this.dbHubService.readComms(where)

      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setCommMaxUsers(jwtPayload: JwtPayloadType, data: SetCommMaxUsersDataType) {
    const where = '/admin/community/setCommMaxUsers'
    try {
      const {commOId, maxUsers} = data

      await this.dbHubService.updateCommMaxUsers(where, commOId, maxUsers)
      const {comms} = await this.dbHubService.readComms(where)

      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async setUserCommAuthByCommService(jwtPayload: JwtPayloadType, data: SetCommAuthDataType) {
    const where = '/admin/community/setUserCommAuth'
    try {
      const {uOId, commOId, authVal} = data
      if (!uOId) throw {uOId: '왜 서버로 유저가 안 왔을까', gkdStatus: {uOId}, where}
      if (!commOId) throw {commOId: '왜 서버로 공동체가 안 왔을까', gkdStatus: {commOId}, where}

      await this.dbHubService.updateCommUserAuth(where, commOId, uOId, authVal)
      const {comms} = await this.dbHubService.readComms(where)

      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA3: /admin/userList
  async addUserByUserService(jwtPayload: JwtPayloadType, data: AddUserDataType) {
    const where = '/admin/userList/addUser'
    try {
      const {id, password, commOId} = data
      if (!id) throw {gkd: {id: '유저를 추가하는데 ID 가 비어?'}, gkdStatus: {}, where}
      if (!password) throw {gkd: {password: '유저를 추가하는데 비번이 비어?'}, gkdStatus: {}, where}
      if (!commOId)
        throw {gkd: {commOId: '어디에 유저를 추가할지 전달해야지'}, gkdStatus: {}, where}

      await this.dbHubService.createUser(where, id, password, commOId)
      const {users} = await this.dbHubService.readUsers(where)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async getAuthValByUserService(jwtPayload: JwtPayloadType, commOId: string, uOId: string) {
    const where = '/admin/userList/getAuthVal'
    try {
      if (!commOId || !uOId) {
        throw {gkd: {param: 'URL 파라미터를 똑바로 전달하세요'}, gkdStatus: {commOId, uOId}, where}
      }
      const {user} = await this.dbHubService.readUserByUOId(where, uOId)

      if (!user) {
        throw {gkd: {uOId: '이런 유저가 없어용...'}, gkdStatus: {uOId}, where}
      }

      if (commOId === 'admin') {
        if (user.id === 'GKD_Master') {
          return {authVal: 1}
        } // BLANK LINE COMMENT:
        else {
          return {authVal: 0}
        }
      }

      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      return {authVal}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getCommNameByUserService(jwtPayload: JwtPayloadType, commOId: string) {
    const where = '/admin/userList/getCommName'
    try {
      if (!commOId) throw {gkd: {commOId: '이거 서버에 안 들어왔어요'}, gkdStatus: {commOId}, where}

      // 이거 에러 아니다. 이걸로 출력하는거다.
      if (commOId === 'admin') return {commName: '관리자'}

      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const {name: commName} = comm
      return {commName}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getCommsRows(jwtPayload: JwtPayloadType) {
    const where = '/admin/userList/getCommsRows'
    try {
      const {commsArr} = await this.dbHubService.readCommsArr(where)
      const commsRowsArr: CommsRowType[] = commsArr.map(comm => {
        return {commOId: comm.commOId, name: comm.name}
      })
      return {commsRowsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getUsersByUserService(jwtPayload: JwtPayloadType) {
    const where = '/admin/userList/getUsersByUserService'
    try {
      const {users} = await this.dbHubService.readUsers(where)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async setUserCommAuthByUserService(jwtPayload: JwtPayloadType, data: SetCommAuthDataType) {
    const where = '/admin/userList/setUserCommAuth'
    try {
      const {uOId, commOId, authVal} = data
      if (!uOId) throw {gkd: {uOId: '왜 서버로 유저가 안 왔을까'}, gkdStatus: {uOId}, where}
      if (!commOId)
        throw {gkd: {commOId: '왜 서버로 공동체가 안 왔을까'}, gkdStatus: {commOId}, where}

      await this.dbHubService.updateCommUserAuth(where, commOId, uOId, authVal)
      const {users} = await this.dbHubService.readUsers(where)

      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA4: /admin/logList
  async getLogsArr(jwtPayload: JwtPayloadType) {
    const where = '/admin/logList/getLogsArr'
    try {
      const {logsArr} = await this.dbHubService.readLogsArr()
      return {logsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async getUsersByLogService(jwtPayload: JwtPayloadType) {
    const where = '/admin/logList/getUsersByLogService'
    try {
      const {users} = await this.dbHubService.readUsers(where)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 이거 중복해서 많이 쓸 듯 하다.
   */
  async _getCommUsersAuthArr(where: string, commOId: string) {
    where = where + '_getCommUsersAuthArr'
    try {
      const {usersArr} = await this.dbHubService.readUsersArrByCommOId(where, commOId)
      const {comm} = await this.dbHubService.readCommByCommOId(where, commOId)
      const commUsersArr: UserInfoAuthType[] = usersArr.map((user, idx) => {
        const elem: UserInfoAuthType = {
          uOId: user.uOId,
          id: user.id,
          commOId: user.commOId,
          authVal: comm.users[user.uOId],
          unreadMessages: user.unreadMessages
        }
        return elem
      })
      return {commUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
