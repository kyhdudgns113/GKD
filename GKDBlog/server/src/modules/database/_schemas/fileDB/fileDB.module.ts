import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {CommentDBSchema, CommentDB, FileDBSchema} from './fileDB.entity'
import {FileDB} from './fileDB.entity'
import {FileDBService} from './fileDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: CommentDB.name, schema: CommentDBSchema},
      {name: FileDB.name, schema: FileDBSchema}
    ])
  ],
  providers: [FileDBService],
  exports: [FileDBService]
})
export class FileDBModule {}
