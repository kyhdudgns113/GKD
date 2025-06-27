import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ChatDB, ChatRoomDB, ChatRoomTable, ChatDBSchema, ChatRoomTableSchema, ChatRoomDBSchema} from './chatDB.entity'
import {ChatDBService} from './chatDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ChatDB.name, schema: ChatDBSchema},
      {name: ChatRoomTable.name, schema: ChatRoomTableSchema},
      {name: ChatRoomDB.name, schema: ChatRoomDBSchema}
    ])
  ],
  providers: [ChatDBService],
  exports: [ChatDBService]
})
export class ChatDBModule {}
