import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {GDocument, GDocumentSchema} from './docDB.entity'
import {GDocumentDBService} from './docDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: GDocument.name, schema: GDocumentSchema}])],
  providers: [GDocumentDBService],
  exports: [GDocumentDBService]
})
export class GDocumentModule {}
