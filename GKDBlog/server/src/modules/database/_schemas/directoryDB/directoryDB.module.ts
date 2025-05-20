import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {DirectoryDB, DirectoryDBSchema} from './directoryDB.entity'
import {DirectoryDBService} from './directoryDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: DirectoryDB.name, schema: DirectoryDBSchema}])],
  providers: [DirectoryDBService],
  exports: [DirectoryDBService]
})
export class DirectoryDBModule {}
