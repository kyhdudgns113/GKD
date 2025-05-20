import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {Chat, ChatRoom, ChatRoomSchema, ChatSchema} from './chatDB.entity'
import {ChatDBService} from './chatDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: ChatRoom.name, schema: ChatRoomSchema}]),
    MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}])
  ],
  providers: [ChatDBService],
  exports: [ChatDBService]
})
export class ChatDBModule {}
