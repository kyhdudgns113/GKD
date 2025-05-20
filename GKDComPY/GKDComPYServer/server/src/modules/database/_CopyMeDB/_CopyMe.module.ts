import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {___CopyMe, ___CopyMeSchema} from './_CopyMe.entity'
import {___CopyMeService} from './_CopyMe.service'

@Module({
  imports: [MongooseModule.forFeature([{name: ___CopyMe.name, schema: ___CopyMeSchema}])],
  providers: [___CopyMeService],
  exports: [___CopyMeService]
})
export class ___CopyMeModule {}
