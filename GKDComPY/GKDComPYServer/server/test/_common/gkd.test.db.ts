import mongoose, {Types} from 'mongoose'
import {gkdSaltOrRounds} from '../../src/common/secret'
import {
  ChatRoomType,
  ChatType,
  ClubInfoType,
  CommunityInfoType,
  EMemberType,
  UserInfoType
} from '../../src/common/types'
import * as bcrypt from 'bcrypt'

export class TestDB {
  private static db: mongoose.mongo.Db = null
  private static chatRoomsArr2D: ChatRoomType[][] = []
  private static clubNamesArr: string[] = ['후보군', `testClub1`, `testClub2`]
  private static clubsArr2D: ClubInfoType[][] = []
  private static numClubs: number = 0
  private static numComms: number = 0
  private static commsArr: CommunityInfoType[] = []
  private static usersArr2D: UserInfoType[][] = []

  constructor() {
    TestDB.numClubs = TestDB.clubNamesArr.length
  }

  async cleanUpDB() {
    if (TestDB.db === null) return
    try {
      for (let i = 0; i < TestDB.numComms; i++) {
        await this._deleteDBs(i)
      }

      TestDB.chatRoomsArr2D = []
      TestDB.clubsArr2D = []
      TestDB.commsArr = []
      TestDB.usersArr2D = []

      await this._checkRemainDB()

      console.log('DB 가 리셋되었습니다.')
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    } finally {
      TestDB.db = null
    }
  }
  async initTestDB(db: mongoose.mongo.Db, commLen: number = 2) {
    try {
      if (TestDB.db !== null) return
      console.log(`DB 가 초기화 되고 있습니다...`)
      TestDB.db = db
      TestDB.numComms = commLen

      for (let i = 0; i < TestDB.numComms; i++) {
        console.log(`-- ${i} 생성중...`)
        await this._createComm(i)
        await this._createClubs(i)
        await this._createUsers(i)
        await this._createEMembers(i)
        await this._createChatRooms(i)
      }
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  readChatRoom(commIdx: number, clubIdx: number) {
    try {
      const chatRoom = TestDB.chatRoomsArr2D[commIdx][clubIdx]
      return {chatRoom}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  readClub(commIdx: number, clubIdx: number) {
    try {
      const club = TestDB.clubsArr2D[commIdx][clubIdx]
      return {club}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  readComm(commIdx: number) {
    try {
      const comm = TestDB.commsArr[commIdx]
      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  readUser(commIdx: number, userIdx: number) {
    try {
      const user = TestDB.usersArr2D[commIdx][userIdx]
      return {user}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  getNumClubs() {
    return {numClubs: TestDB.numClubs}
  }
  getNumComms() {
    return {numComms: TestDB.numComms}
  }

  private async _createChatRooms(idx: number) {
    try {
      const length = 30
      const clubsArr = TestDB.clubsArr2D[idx]
      const usersArr = TestDB.usersArr2D[idx]
      const usersArrLen = usersArr.length
      // 테스트용 채팅을 뙇!!
      const chatsArr: ChatType[] = Array(length)
        .fill(null)
        .map((_, chatIdx) => {
          const date = new Date()
          const userIdx = chatIdx % usersArrLen
          const {uOId, id} = usersArr[userIdx]
          const content = `testChat${chatIdx}`
          const chat: ChatType = {chatIdx, date, uOId, id, content}
          return chat
        })

      const chatRoomsArr: ChatRoomType[] = []

      for (let i = 0; i < clubsArr.length; i++) {
        // 채팅방을 뙇!!
        const club = clubsArr[i]
        const {clubOId} = club
        const res = await TestDB.db.collection('chatrooms').insertOne({clubOId, length, chatsArr})

        // club 정보 갱신 뙇!!
        const chatRoomOId = res.insertedId.toString()
        TestDB.clubsArr2D[idx][i].chatRoomOId = chatRoomOId
        await TestDB.db
          .collection('clubs')
          .updateOne({_id: new Types.ObjectId(clubOId)}, {$set: {chatRoomOId}})

        // 1차원 배열에 뙇!!
        const chatRoom: ChatRoomType = {chatRoomOId, clubOId, length, chatsArr}
        chatRoomsArr.push(chatRoom)
      }
      // 멤버 변수에 뙇!!
      TestDB.chatRoomsArr2D.push(chatRoomsArr)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createClubs(idx: number) {
    try {
      const comm = TestDB.commsArr[idx]
      const {commOId} = comm
      const namesArr = TestDB.clubNamesArr
      const clubsArr: ClubInfoType[] = []

      for (let i = 0; i < namesArr.length; i++) {
        const name = namesArr[i]
        const res = await TestDB.db.collection('clubs').insertOne({commOId, name})
        const clubOId = res.insertedId.toString()
        clubsArr.push({clubOId, name, commOId, weekRowsArr: [], chatRoomOId: '', docOId: ''})

        // clubOIdsArr 갱신
        // push 를 쓰니까 에러가 떠서 set 으로 바꿨다.
        TestDB.commsArr[idx].clubOIdsArr = [...TestDB.commsArr[idx].clubOIdsArr, clubOId]
        const {clubOIdsArr} = TestDB.commsArr[idx]
        await TestDB.db
          .collection('communities')
          .updateOne({name: comm.name}, {$set: {clubOIdsArr}})
      }

      TestDB.clubsArr2D.push(clubsArr)
      return {clubsArr}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createComm(idx: number) {
    try {
      const name = `testComm${idx}`

      const res = await TestDB.db.collection('communities').insertOne({name})
      const commOId = res.insertedId.toString()

      const comm: CommunityInfoType = {
        commOId,
        name,
        users: {},
        clubOIdsArr: [],
        maxClubs: 5,
        maxUsers: 8
      }
      TestDB.commsArr.push(comm)
      return {comm}
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createUsers(idx: number) {
    try {
      const comm = TestDB.commsArr[idx]
      const {commOId} = comm
      const usersArr: UserInfoType[] = []

      for (let i = 0; i < 3; i++) {
        // 유저 생성 뙇!!
        const id = `testUser${idx}${i}`
        const pw = `testUser${idx}${i}sPW`
        const hashedPassword = bcrypt.hashSync(pw, gkdSaltOrRounds)
        const res = await TestDB.db.collection('users').insertOne({id, hashedPassword, commOId})

        // 멤버 변수에 넣기 위한 1차원 배열 뙇!!
        const uOId = res.insertedId.toString()
        const user: UserInfoType = {uOId, id, commOId, unreadMessages: {}}
        usersArr.push(user)

        // 공동체의 유저 권한을 i 로 설정 뙇!!
        await TestDB.db
          .collection('communities')
          .updateOne({name: comm.name}, {$set: {[`users.${uOId}`]: i}})
        TestDB.commsArr[idx].users[uOId] = i
      }

      // 멤버 변수에 뙇!!
      TestDB.usersArr2D.push(usersArr)
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _createEMembers(idx: number) {
    try {
      if (TestDB.usersArr2D.length === 0) throw `이 함수는 유저를 만들고 실행해주세요`
      if (TestDB.clubsArr2D.length === 0) throw `이 함수는 클럽을 만들고 실행해주세요`

      const {commOId} = this.readComm(idx).comm
      const clubLen = TestDB.clubNamesArr.length

      const eMembersArr: EMemberType[] = []
      for (let colIdx = 0; colIdx < clubLen; colIdx++) {
        const clubIdx = (colIdx + 1) % clubLen
        const {clubOId} = this.readClub(idx, clubIdx).club

        await TestDB.db.collection('emembers').insertOne({commOId, clubOId, colIdx, eMembersArr})
      }

      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }

  private async _deleteDBs(idx: number) {
    try {
      const {commOId} = TestDB.commsArr[idx]
      const db = TestDB.db

      // 채팅방 삭제 뙇!!
      for (let i = 0; i < TestDB.clubsArr2D[idx].length; i++) {
        const {clubOId} = TestDB.clubsArr2D[idx][i]
        await db.collection('chatrooms').deleteOne({clubOId})
      }

      await db.collection('users').deleteMany({commOId})
      await db.collection('emembers').deleteMany({commOId})
      await db.collection('clubs').deleteMany({commOId})
      await db.collection('communities').deleteMany({_id: new Types.ObjectId(commOId)})
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      throw errObj
    }
  }
  private async _checkRemainDB() {
    try {
      const db = TestDB.db

      console.log('CHECK REMAINNING...')

      const cards = await db.collection('cards').countDocuments()
      if (cards > 0) throw 'card 가 남아있어요.'

      const chatrooms = await db.collection('chatrooms').countDocuments()
      if (chatrooms > 0) throw `chatroom 이 남아있어요. ${chatrooms}`

      const chats = await db.collection('chats').countDocuments()
      if (chats > 0) throw 'chat 이 남아있어요.'

      const clubs = await db.collection('clubs').countDocuments()
      if (clubs > 0) throw 'club 이 남아있어요.'

      const communities = await db.collection('communities').countDocuments()
      if (communities > 0) throw 'community 가 남아있어요.'

      const dailyrecords = await db.collection('dailyrecords').countDocuments()
      if (dailyrecords > 0) throw 'dailyrecord 가 남아있어요.'

      const emembers = await db.collection('emembers').countDocuments()
      if (emembers > 0) throw 'emember 가 남아있어요.'

      const gdocuments = await db.collection('gdocuments').countDocuments()
      if (gdocuments > 0) throw 'gdocument 가 남아있어요.'

      const gkdlogs = await db.collection('gkdlogs').countDocuments()
      if (gkdlogs > 0) throw 'gkdlog 가 남아있어요.'

      const members = await db.collection('members').countDocuments()
      if (members > 0) throw 'member 가 남아있어요.'

      const recordblocks = await db.collection('recordblocks').countDocuments()
      if (recordblocks > 0) throw 'recordblock 이 남아있어요.'

      const users = await db.collection('users').countDocuments()
      if (users > 0) throw 'user 가 남아있어요.'

      const weeklyrecords = await db.collection('weeklyrecords').countDocuments()
      if (weeklyrecords > 0) throw 'weeklyrecord 가 남아있어요.'

      const weekrows = await db.collection('weekrows').countDocuments()
      if (weekrows > 0) throw 'weekrows 가 남아있어요.'

      return users
      // BLANK LINE COMMENT:
    } catch (errObj) {
      // BLANK LINE COMMENT:
      console.log(errObj)
      throw errObj
    }
  }
}
