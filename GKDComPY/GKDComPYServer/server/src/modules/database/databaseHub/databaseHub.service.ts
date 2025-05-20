import {Injectable} from '@nestjs/common'

import {
  EMemberType,
  JwtPayloadType,
  MemberInfoType,
  PokerUserType,
  RecordMemberInfoType
} from 'src/common/types'

import * as S from '../_schemas'

/**
 * 이곳은 거의 대부분 Schema 의 함수랑 결과를 그대로 보내주는 역할만 한다.
 *
 * 이것들은 port 에서 해줘야 한다.
 * - 인자의 Error 체크
 * - 권한 체크 함수 실행
 *    - port 에서 db 접근할때마다 권한체크하면 오버헤드 심해진다.
 *
 * 이건 여기서 해준다.
 * - 권한 체크 함수 작성
 */
@Injectable()
export class DatabaseHubService {
  constructor(
    private readonly chatDBService: S.ChatDBService,
    private readonly clubDBService: S.ClubDBService,
    private readonly commDBService: S.CommunityDBService,
    private readonly dailyDBService: S.DailyRecordDBService,
    private readonly docDBService: S.GDocumentDBService,
    private readonly eMemberDBService: S.EMemberDBService,
    private readonly logDBService: S.GKDLogDBService,
    private readonly memberDBService: S.MemberDBService,
    private readonly pokerSettingDBService: S.GameSettingDBService,
    private readonly pokerUserDBService: S.PokerUserDBService,
    private readonly userDBService: S.UserDBService,
    private readonly weeklyDBService: S.WeeklyRecordDBService
  ) {}
  // AREA1: CommDB CRUD
  async createCommunity(where: string, name: string) {
    try {
      await this.commDBService.createCommunity(where, name)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readCommByCommOId(where: string, commOId: string) {
    try {
      const {comm} = await this.commDBService.readCommByCommOId(where, commOId)
      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readCommByName(where: string, name: string) {
    try {
      const {comm} = await this.commDBService.readCommByName(where, name)
      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readComms(where: string) {
    try {
      const {comms} = await this.commDBService.readComms(where)
      return {comms}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readCommsArr(where: string) {
    try {
      const {commsArr} = await this.commDBService.readCommsArr(where)
      return {commsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateCommBCOId(where: string, commOId: string, banClubOId: string) {
    try {
      await this.commDBService.updateCommBCOId(where, commOId, banClubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommCOIdsByCOIDs(where: string, commOId: string, clubOIdsArr: string[]) {
    try {
      await this.commDBService.updateCommCOIdsByCOIDs(where, commOId, clubOIdsArr)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommLastClubOIDs(where: string, commOId: string, clubOId: string) {
    try {
      await this.commDBService.updateCommLastClubOIDs(where, commOId, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommMaxClubs(where: string, commOId: string, maxClubs: number) {
    try {
      await this.commDBService.updateCommMaxClubs(where, commOId, maxClubs)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommMaxUsers(where: string, commOId: string, maxUsers: number) {
    try {
      await this.commDBService.updateCommMaxUsers(where, commOId, maxUsers)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommName(where: string, commOId: string, name: string) {
    try {
      await this.commDBService.updateCommName(where, commOId, name)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateCommUserAuth(where: string, commOId: string, uOId: string, authVal: number | null) {
    try {
      await this.commDBService.updateCommUserAuth(where, commOId, uOId, authVal)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteClubInCommunity(where: string, commOId: string, clubOId: string) {
    try {
      await this.commDBService.deleteClubInCommunity(where, commOId, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteCommUser(where: string, commOId: string, uOId: string) {
    try {
      await this.commDBService.deleteCommUser(where, commOId, uOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteCommUserAuthVal(where: string, commOId: string, uOId: string) {
    try {
      await this.commDBService.deleteCommUserAuthVal(where, commOId, uOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: EMember CRUD
  async createEMemArr(
    where: string,
    commOId: string,
    clubOId: string,
    colIdx: number,
    eMembersArr: EMemberType[]
  ) {
    try {
      await this.eMemberDBService.createEMemArr(where, commOId, clubOId, colIdx, eMembersArr)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readEMemArr(where: string, commOId: string, colIdx: number) {
    try {
      const {eMembersArr} = await this.eMemberDBService.readEMemArr(where, commOId, colIdx)
      return {eMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateEMemArr(
    where: string,
    commOId: string,
    clubOId: string,
    colIdx: number,
    eMembersArr: EMemberType[]
  ) {
    try {
      await this.eMemberDBService.updateEMemArr(where, commOId, clubOId, colIdx, eMembersArr)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateEMemArrColIdx(where: string, commOId: string, prevIdx: number, aftIdx: number) {
    try {
      await this.eMemberDBService.updateEMemArrColIdx(where, commOId, prevIdx, aftIdx)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateEMemArrColIdxByClubOId(where: string, clubOId: string, nextIdx: number) {
    try {
      await this.eMemberDBService.updateEMemArrColIdxByClubOId(where, clubOId, nextIdx)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteEMemArr(where: string, commOId: string, clubOId: string) {
    try {
      await this.eMemberDBService.deleteEMemArr(where, commOId, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA3: ClubDB CRUD
  async createClub(where: string, commOId: string, name: string) {
    try {
      await this.clubDBService.createClub(where, commOId, name)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readClubByClubOId(where: string, clubOId: string) {
    try {
      const {club} = await this.clubDBService.readClubByClubOId(where, clubOId)
      return {club}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readClubByName(where: string, commOId: string, name: string) {
    try {
      const {club} = await this.clubDBService.readClubByName(where, commOId, name)
      return {club}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readClubCreatePrevLimit(where: string, clubOId: string) {
    try {
      const {lastAddPrevWeekDate, numOfAddedPrevWeek} =
        await this.clubDBService.readClubCreatePrevLimit(where, clubOId)
      return {lastAddPrevWeekDate, numOfAddedPrevWeek}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readClubsArrByClubOIdsArr(where: string, clubOIdsArr: string[]) {
    try {
      const {clubsArr} = await this.clubDBService.readClubsArrByClubOIdsArr(where, clubOIdsArr)
      return {clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateClubCreatePrevLimit(
    where: string,
    clubOId: string,
    todayValue: number,
    newValue: number
  ) {
    try {
      await this.clubDBService.updateClubCreatePrevLimit(where, clubOId, todayValue, newValue)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubsChatRoomOId(where: string, clubOId: string, chatRoomOId: string) {
    try {
      await this.clubDBService.updateClubsChatRoomOId(where, clubOId, chatRoomOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubWeekRowsArrPop(where: string, clubOId: string, idx: number) {
    try {
      await this.clubDBService.updateClubWeekRowsArrPop(where, clubOId, idx)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubWeekRowsArrPushBack(
    where: string,
    clubOId: string,
    weekOId: string,
    start: number,
    end: number
  ) {
    try {
      await this.clubDBService.updateClubWeekRowsArrPushBack(where, clubOId, weekOId, start, end)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateClubWeekRowsArrPushFront(
    where: string,
    clubOId: string,
    weekOId: string,
    start: number,
    end: number
  ) {
    try {
      await this.clubDBService.updateClubWeekRowsArrPushFront(where, clubOId, weekOId, start, end)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteClubByClubOId(where: string, clubOId: string) {
    try {
      await this.clubDBService.deleteClubByClubOId(where, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA4: MemberDB CRUD
  async createMember(
    where: string,
    commOId: string,
    clubOId: string,
    name: string,
    batterPower: number,
    pitcherPower: number
  ) {
    try {
      await this.memberDBService.createMember(
        where,
        commOId,
        clubOId,
        name,
        batterPower,
        pitcherPower
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  /**
   * 멤버 관리 페이지에서 쓰는 함수. \
   * clubOId 클럽의 인덱스를 colIdx 라고 설정한 뒤 멤버 배열을 받는다. \
   * MemberInfoType 이 아닌 EMemberType 이다.
   *
   * @param clubOId : 어떤 클럽인지 넘겨준다.
   * @param colIdx : 멤버들의 colIdx 를 이 값으로 설정한다.
   * @returns {eMembersArr: EMemberType[colIdx][memIdx]} : colIdx 번째 클럽의 멤버배열
   */
  async readEMembersArrByClubOId(where: string, clubOId: string, colIdx: number) {
    try {
      const {eMembersArr} = await this.memberDBService.readEMembersArrByClubOId(
        where,
        clubOId,
        colIdx
      )
      return {eMembersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readMemberByClubOIdName(where: string, clubOId: string, name: string) {
    try {
      const {member} = await this.memberDBService.readMemberByClubOIdName(where, clubOId, name)
      return {member}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMemberByMemOId(where: string, memOId: string) {
    try {
      const {member} = await this.memberDBService.readMemberByMemOId(where, memOId)
      return {member}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMembersArrByClubOId(where: string, clubOId: string) {
    try {
      const {membersArr} = await this.memberDBService.readMembersArrByClubOId(where, clubOId)
      return {membersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMembersArrOnlyLegacy(where: string, commOId: string, name: string) {
    try {
      const {membersArr} = await this.memberDBService.readMembersArrOnlyLegacy(where, commOId, name)
      return {membersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readMembersArrNoLegacy(where: string, commOId: string, name: string) {
    try {
      const {membersArr} = await this.memberDBService.readMembersArrNoLegacy(where, commOId, name)
      return {membersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateMemberCard(
    where: string,
    memOId: string,
    posIdx: number,
    name: string,
    skillIdxs: number[],
    skillLevels: number[]
  ) {
    try {
      await this.memberDBService.updateMemberCard(
        where,
        memOId,
        posIdx,
        name,
        skillIdxs,
        skillLevels
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemberComment(where: string, clubOId: string, memOId: string, memberComment: string) {
    try {
      await this.memberDBService.updateMemberComment(where, clubOId, memOId, memberComment)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemberInfo(
    where: string,
    memOId: string,
    name: string,
    batterPower: number | null,
    pitcherPower: number | null,
    clubOId: string | null,
    comment: string
  ) {
    try {
      await this.memberDBService.updateMemberInfo(
        where,
        memOId,
        name,
        batterPower,
        pitcherPower,
        clubOId,
        comment
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMembersClub(where: string, memOId: string, clubOId: string) {
    try {
      await this.memberDBService.updateMembersClub(where, memOId, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMembersLastRecorded(where: string, clubOId: string, start: number) {
    try {
      await this.memberDBService.updateMembersLastRecorded(where, clubOId, start)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateMemPos(where: string, memOId: string, position: number) {
    try {
      await this.memberDBService.updateMemPos(where, memOId, position)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 여기서 멤버의 이름도 바꾼다
   */
  async updateMemPower(
    where: string,
    memOId: string,
    name: string,
    batterPower: number | null,
    pitcherPower: number | null
  ) {
    try {
      await this.memberDBService.updateMemPower(where, memOId, name, batterPower, pitcherPower)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteMember(where: string, memOId: string) {
    try {
      await this.memberDBService.deleteMember(where, memOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteMembersByClubOId(where: string, clubOId: string) {
    try {
      await this.memberDBService.deleteMembersByClubOId(where, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA5: UserDB CRUD
  async createUser(where: string, id: string, password: string, commOId?: string) {
    try {
      await this.userDBService.createUser(where, id, password, commOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readUserByIdPassword(where: string, id: string, password: string) {
    try {
      const {user} = await this.userDBService.readUserByIdPassword(where, id, password)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUserByUOId(where: string, uOId: string) {
    try {
      const {user} = await this.userDBService.readUserByUOId(where, uOId)
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUsers(where: string) {
    try {
      const {users} = await this.userDBService.readUsers(where)
      return {users}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readUsersArrByCommOId(where: string, commOId: string) {
    try {
      const {usersArr} = await this.userDBService.readUsersArrByCommOId(where, commOId)
      return {usersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateUser(
    where: string,
    commOId: string,
    uOId: string,
    id: string,
    password: string,
    authVal: number | null
  ) {
    try {
      await this.userDBService.updateUser(where, commOId, uOId, id, password, authVal)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateUserSelf(
    where: string,
    uOId: string,
    id: string,
    prevPassword: string,
    newPassword: string
  ) {
    try {
      await this.userDBService.updateUserSelf(where, uOId, id, prevPassword, newPassword)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateUserUnreadMessages(where: string, uOId: string, chatRoomOId: string) {
    try {
      await this.userDBService.updateUserUnreadMessages(where, uOId, chatRoomOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteUserByUOId(where: string, uOId: string) {
    try {
      await this.userDBService.deleteUserByUOId(where, uOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteUsersUnreadMessageCnt(where: string, uOId: string, chatRoomOId: string) {
    try {
      await this.userDBService.deleteUsersUnreadMessageCnt(where, uOId, chatRoomOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA6: WeeklyRecord CRUD
  async createWeeklyRecord(
    where: string,
    clubOId: string,
    start: number,
    end: number,
    rowInfosArr: RecordMemberInfoType[]
  ) {
    try {
      const {weeklyRecord} = await this.weeklyDBService.createWeeklyRecord(
        where,
        clubOId,
        start,
        end,
        rowInfosArr
      )
      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createWeeklyMember(
    where: string,
    weekOId: string,
    position: number,
    name: string,
    batterPower: number,
    pitcherPower: number,
    memOId: string | null
  ) {
    try {
      await this.weeklyDBService.createWeeklyMember(
        where,
        weekOId,
        position,
        name,
        batterPower,
        pitcherPower,
        memOId
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readWeeklyRecord(where: string, weekOId: string) {
    try {
      const {weeklyRecord} = await this.weeklyDBService.readWeeklyRecord(where, weekOId)
      return {weeklyRecord}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateWeeklyColComments(where: string, weekOId: string, dayIdx: number, comments: string) {
    try {
      await this.weeklyDBService.updateWeeklyColComments(where, weekOId, dayIdx, comments)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyComments(where: string, weekOId: string, comment: string) {
    try {
      await this.weeklyDBService.updateWeeklyComments(where, weekOId, comment)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyMemOId(where: string, clubOId: string, member: MemberInfoType) {
    try {
      await this.weeklyDBService.updateWeeklyMemOId(where, clubOId, member)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyRowMember(
    where: string,
    weekOId: string,
    prevName: string,
    position: number,
    name: string,
    batterPower: number,
    pitcherPower: number,
    memOId: string | null
  ) {
    try {
      await this.weeklyDBService.updateWeeklyRowMember(
        where,
        weekOId,
        prevName,
        position,
        name,
        batterPower,
        pitcherPower,
        memOId
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateWeeklyTHead(
    where: string,
    weekOId: string,
    dateIdx: number,
    enemyName: string,
    pitchOrder: number,
    order: string
  ) {
    try {
      await this.weeklyDBService.updateWeeklyTHead(
        where,
        weekOId,
        dateIdx,
        enemyName,
        pitchOrder,
        order
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deleteWeeklyRecord(where: string, weekOId: string) {
    try {
      await this.weeklyDBService.deleteWeeklyRecord(where, weekOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteWeeklyRowMember(where: string, weekOId: string, name: string) {
    try {
      await this.weeklyDBService.deleteWeeklyRowMember(where, weekOId, name)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA1: DailyRecord CRUD
  async createOrUpdateRecord(
    where: string,
    clubOId: string,
    date: number,
    name: string,
    condError: number,
    results: number[],
    comment: string,
    memOId: string | null
  ) {
    try {
      await this.dailyDBService.createOrUpdateRecord(
        where,
        clubOId,
        date,
        name,
        condError,
        results,
        comment,
        memOId
      )
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readDailyArrByMemberWithRange(where: string, memOId: string, start: number, end: number) {
    try {
      const {dailyRecordsArr} = await this.dailyDBService.readDailyArrByMemberWithRange(
        where,
        memOId,
        start,
        end
      )
      return {dailyRecordsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readDailyArrByWeeklyInfo(where: string, clubOId: string, start: number, end: number) {
    try {
      const {recordsArr} = await this.dailyDBService.readDailyArrByWeeklyInfo(
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
  async updateRecordName(
    where: string,
    clubOId: string,
    start: number,
    end: number,
    prevName: string,
    name: string
  ) {
    try {
      await this.dailyDBService.updateRecordName(where, clubOId, start, end, prevName, name)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateDailyMemOId(where: string, clubOId: string, member: MemberInfoType) {
    try {
      await this.dailyDBService.updateDailyMemOId(where, clubOId, member)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteDailyRecords(
    where: string,
    clubOId: string,
    name: string,
    start: number,
    end: number
  ) {
    try {
      await this.dailyDBService.deleteDailyRecords(where, clubOId, name, start, end)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteDailyRecordsClub(where: string, clubOId: string, start: number, end: number) {
    try {
      await this.dailyDBService.deleteDailyRecordsClub(where, clubOId, start, end)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: Chat CRUD
  async createChatRoom(where: string, clubOId: string) {
    try {
      return await this.chatDBService.createChatRoom(where, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readChatRoom(where: string, chatRoomOId: string) {
    try {
      const {chatRoom} = await this.chatDBService.readChatRoom(where, chatRoomOId)
      return {chatRoom}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateChatRoomsChat(
    where: string,
    chatRoomOId: string,
    uOId: string,
    id: string,
    content: string
  ) {
    try {
      const {chat} = await this.chatDBService.updateChatRoomsChat(
        where,
        chatRoomOId,
        uOId,
        id,
        content
      )
      return {chat}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteChatroomByClubOId(where: string, clubOId: string) {
    try {
      await this.chatDBService.deleteChatroomByClubOId(where, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA3: Document CRUD
  async createDoc(where: string, clubOId: string) {
    try {
      const {doc} = await this.docDBService.createDoc(where, clubOId)
      return {doc}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readDocContentsByClubOId(where: string, clubOId: string) {
    try {
      const {contents} = await this.docDBService.readDocContentsByClubOId(where, clubOId)
      return {contents}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async updateDocumentWithClubOId(where: string, clubOId: string, contents: string[]) {
    try {
      await this.docDBService.updateDocumentWithClubOId(where, clubOId, contents)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async deleteDocByClubOId(where: string, clubOId: string) {
    try {
      await this.docDBService.deleteDocByClubOId(where, clubOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA4: Logger Area
  async createLog(where: string, uOId: string, userId: string, gkdLog: string, gkdStatus: Object) {
    try {
      await this.logDBService.createLog(where, uOId, userId, gkdLog, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createGKDErr(
    where: string,
    uOId: string,
    userId: string,
    gkdErr: string,
    gkdStatus: Object
  ) {
    try {
      await this.logDBService.createGKDErr(where, uOId, userId, gkdErr, gkdStatus)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async createGKDErrObj(where: string, uOId: string, userId: string, gkdErrObj: Object) {
    try {
      await this.logDBService.createGKDErrObj(where, uOId, userId, gkdErrObj)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readLogsArr() {
    try {
      const {logsArr} = await this.logDBService.readLogsArr()
      return {logsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA1: Poker Game Setting Area
  async createGameSetting(where: string, bigBlind: number, rebuy: number, smallBlind: number) {
    try {
      const {setting} = await this.pokerSettingDBService.createGameSetting(
        where,
        bigBlind,
        rebuy,
        smallBlind
      )
      return {setting}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readGameSetting(where: string) {
    try {
      const {setting} = await this.pokerSettingDBService.readGameSetting(where)
      return {setting}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updateGameSetting(where: string, bigBlind: number, rebuy: number, smallBlind: number) {
    try {
      const {setting} = await this.pokerSettingDBService.updateGameSetting(
        where,
        bigBlind,
        rebuy,
        smallBlind
      )
      return {setting}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA2: Poker User Area
  async createPokerUser(where: string, name: string) {
    try {
      await this.pokerUserDBService.createPokerUser(where, name)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async readPokerUserByName(where: string, name: string) {
    try {
      const {pokerUser} = await this.pokerUserDBService.readPokerUserByName(where, name)
      return {pokerUser}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async readPokerUsersAndArr(where: string) {
    try {
      const {pokerUsers, pokerUsersArr} = await this.pokerUserDBService.readPokerUsersAndArr(where)
      return {pokerUsers, pokerUsersArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async updatePokerUserArr(where: string, pokerUsersArr: PokerUserType[]) {
    try {
      await this.pokerUserDBService.updatePokerUserArr(where, pokerUsersArr)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  async deletePokerUser(where: string, pUOId: string) {
    try {
      await this.pokerUserDBService.deletePokerUser(where, pUOId)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  // AREA5: Check Auth Area

  // AREA4: CheckAuth
  async checkCommMaster(jwtPayload: JwtPayloadType, where: string, commOId: string) {
    where = where + '/checkCommMaster'
    try {
      const {uOId} = jwtPayload
      const {comm} = await this.commDBService.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      if (!authVal || authVal < 2) {
        throw {gkd: {authVal: '클럽장만 사용 가능합니다.'}, gkdStatus: {uOId, commOId}, where}
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkClubDBRead(jwtPayload: JwtPayloadType, where: string, clubOId: string) {
    where = where + '/checkClubDBRead'
    try {
      const {uOId} = jwtPayload
      const {club} = await this.clubDBService.readClubByClubOId(where, clubOId)
      const {commOId} = club
      const {comm} = await this.commDBService.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      if (!authVal)
        throw {gkd: {clubOId: '여기에 접근할 권한이 없어요'}, gkdStatus: {clubOId, uOId}, where}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkClubDBWrite(jwtPayload: JwtPayloadType, where: string, clubOId: string) {
    where = where + '/checkClubDBWrite'
    try {
      const {uOId} = jwtPayload
      const {club} = await this.clubDBService.readClubByClubOId(where, clubOId)
      const {commOId} = club
      const {comm} = await this.commDBService.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      if (!authVal)
        throw {
          gkd: {clubOId: '해당 유저는 이곳에 대한 권한이 없어요'},
          gkdStatus: {uOId, clubOId},
          where
        }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkCommDBWrite(jwtPayload: JwtPayloadType, where: string, commOId: string) {
    where = where + '/checkCommDBWrite'
    try {
      const {uOId} = jwtPayload
      const {comm} = await this.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      if (!authVal) {
        throw {
          gkd: {authVal: '이 토큰으로는 정보에 접근할 수 없습니다.'},
          gkdStatus: {uOId, commOId},
          where
        }
      }
      return true
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkMemDBWrite(jwtPayload: JwtPayloadType, where: string, memOId: string) {
    where = where + '/checkMemDBWrite'
    try {
      const {uOId} = jwtPayload
      const {user} = await this.userDBService.readUserByUOId(where, uOId)
      const {commOId} = user
      const {member} = await this.memberDBService.readMemberByMemOId(where, memOId)
      const {commOId: memCommOId} = member
      if (commOId !== memCommOId)
        throw {gkd: {jwt: '해당 토큰은 권한이 없습니다.'}, gkdStatus: {uOId, memOId}, where}

      const {comm} = await this.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      if (!authVal || authVal === 0) {
        throw {
          gkd: {authVal: '이 토큰으로는 정보에 접근할 수 없습니다.'},
          gkdStatus: {uOId, authVal},
          where
        }
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  /**
   * 토큰이 uOId 의 정보를 읽을 수 있는지 체크한다.
   */
  async checkUserDBRead(jwtPayload: JwtPayloadType, where: string, uOId: string) {
    where = where + '/checkUserDBRead'
    try {
      const {uOId: payloadUOId} = jwtPayload
      if (uOId === payloadUOId) {
        return true
      }
      const {user} = await this.userDBService.readUserByUOId(where, uOId)
      const {commOId} = user
      const {comm} = await this.readCommByCommOId(where, commOId)
      if (comm.users[payloadUOId] <= 0) {
        throw {
          gkd: {checkAuth: '이 토큰으로는 정보에 접근할 수 없습니다.'},
          gkdStatus: {uOId: payloadUOId, targetUOId: uOId},
          where
        }
      }
      return true
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkUserDBWrite(jwtPayload: JwtPayloadType, where: string, uOId: string) {
    where = where + '/checkUserDBWrite'
    try {
      const {uOId: payloadUOId} = jwtPayload
      if (uOId === payloadUOId) {
        return true
      }
      const {user} = await this.userDBService.readUserByUOId(where, uOId)
      const {commOId} = user
      const {comm} = await this.readCommByCommOId(where, commOId)
      if (comm.users[payloadUOId] < 2 && payloadUOId === uOId) {
        throw {
          gkd: {authVal: '이 토큰으로는 정보에 접근할 수 없습니다.'},
          gkdStatus: {uOId: payloadUOId, targetUOId: uOId},
          where
        }
      }
      return true
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkWeeklyDBRead(jwtPayload: JwtPayloadType, where: string, weekOId: string) {
    where = where + '/checkWeeklyDBRead'
    try {
      const {uOId} = jwtPayload
      const {user} = await this.userDBService.readUserByUOId(where, uOId)
      const {weeklyRecord} = await this.weeklyDBService.readWeeklyRecord(where, weekOId)
      const {club} = await this.clubDBService.readClubByClubOId(where, weeklyRecord.clubOId)
      if (user.commOId !== club.commOId)
        throw {
          gkd: {weekOId: '이곳에 접근할 권한이 없습니다'},
          gkdStatus: {uOId, weekOId, start: weeklyRecord.start},
          where
        }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  async checkWeeklyDBWrite(jwtPayload: JwtPayloadType, where: string, weekOId: string) {
    try {
      const {uOId} = jwtPayload
      const {clubOId} = (await this.readWeeklyRecord(where, weekOId)).weeklyRecord
      const {commOId} = (await this.readClubByClubOId(where, clubOId)).club
      const {comm} = await this.readCommByCommOId(where, commOId)
      const authVal = comm.users[uOId]
      if (!authVal) {
        throw {
          gkd: {authVal: '이 토큰으로는 정보에 접근할 수 없습니다.'},
          gkdStatus: {uOId, weekOId},
          where
        }
      }
      return true
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}
