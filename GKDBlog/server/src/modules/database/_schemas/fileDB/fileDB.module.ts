import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {FileDBSchema} from './fileDB.entity'
import {FileDB} from './fileDB.entity'
import {FileDBService} from './fileDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: FileDB.name, schema: FileDBSchema}])],
  providers: [FileDBService],
  exports: [FileDBService]
})
export class FileDBModule {}
