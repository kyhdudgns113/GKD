import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {DirectoryDB} from './directoryDB.entity'
import {Model} from 'mongoose'

@Injectable()
export class DirectoryDBService {
  constructor(@InjectModel(DirectoryDB.name) private directoryModel: Model<DirectoryDB>) {}
}
