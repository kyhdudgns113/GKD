import {Db} from 'mongodb'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../../../../../_common'
import {ClientPortServiceTest} from '../../../../../../src/modules/database/ports/clientPort/clientPort.test'
import {AddMemberDataType, EMemberType, JwtPayloadType} from '../../../../../../src/common/types'

const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 한 클럽에서 여러명의 멤버를 추가한다.
 *   - 3명을 추가가 한다.
 */
export class AddMultipleMember extends GKDTestBase {
  private readonly portService = new ClientPortServiceTest().clientPortService

  private clubOId: string
  private commOId: string
  private jwtPayload: JwtPayloadType
  private name: string
  private name1: string
  private name2: string
  private name3: string

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: Db, logLevel: number) {
    try {
      const {commOId} = this.testDB.readComm(0).comm
      const {id, uOId} = this.testDB.readUser(0, 2).user

      const name = this.constructor.name
      const name1 = name + 1
      const name2 = name + 2
      const name3 = name + 3
      const jwtPayload: JwtPayloadType = {id, uOId}

      const clubDB = await this.db.collection('clubs').insertOne({commOId, name})
      const clubOId = clubDB.insertedId.toString()

      const eMembersArr: EMemberType[] = []
      const colIdx = 3
      await this.db.collection('emembers').insertOne({commOId, clubOId, colIdx, eMembersArr})

      const {clubOIdsArr, name: commName} = this.testDB.readComm(0).comm
      clubOIdsArr.push(clubOId)
      await this.db.collection('communities').updateOne({name: commName}, {$set: {clubOIdsArr}})

      this.clubOId = clubOId
      this.commOId = commOId
      this.jwtPayload = jwtPayload
      this.name = name
      this.name1 = name1
      this.name2 = name2
      this.name3 = name3
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async execTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name1, name2, name3, jwtPayload} = this
      const [batterPower, pitcherPower] = [0, 0]

      const data1: AddMemberDataType = {commOId, clubOId, name: name1, batterPower, pitcherPower}
      const data2: AddMemberDataType = {commOId, clubOId, name: name2, batterPower, pitcherPower}
      const data3: AddMemberDataType = {commOId, clubOId, name: name3, batterPower, pitcherPower}

      // 함수 실행 뙇!!
      await this.portService.addMemberReqByClub(jwtPayload, data1)
      await this.portService.addMemberReqByClub(jwtPayload, data2)
      const {members} = await this.portService.addMemberReqByClub(jwtPayload, data3)

      // 3명만 잘 들어갔나 확인
      const numMem = Object.keys(members).length
      if (numMem !== 3) throw `멤버를 3명을 넣었는데 ${numMem}명이 존재해요`

      // 입력한 멤버가 잘 들어갔었나 확인
      const mNames = {[name1]: true, [name2]: true, [name3]: true}
      for (let mOId of Object.keys(members)) {
        const member = members[mOId]
        delete mNames[member.name]
      }
      if (Object.keys(mNames).length !== 0) throw `여러 멤버 추가가 안된것 같아요`
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  protected async finishTest(db: Db, logLevel: number) {
    try {
      const {clubOId, commOId, name, name1, name2, name3} = this

      await this.db.collection('members').deleteOne({commOId, clubOId, name: name1})
      await this.db.collection('members').deleteOne({commOId, clubOId, name: name2})
      await this.db.collection('members').deleteOne({commOId, clubOId, name: name3})
      await this.db.collection('clubs').deleteOne({commOId, name})
      await this.db.collection('emembers').deleteOne({commOId, clubOId, colIdx: 3})

      const {clubOIdsArr, name: commName} = this.testDB.readComm(0).comm
      while (clubOIdsArr.length > 3) clubOIdsArr.pop()

      await this.db.collection('communities').updateOne({name: commName}, {$set: {clubOIdsArr}})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new AddMultipleMember(DEFAULT_REQUIRED_LOG_LEVEL)
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
