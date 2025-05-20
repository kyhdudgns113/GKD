import {model} from 'mongoose'
import {GDocument, GDocumentSchema} from './docDB.entity'
import {GDocumentDBService} from './docDB.service'

export class GDocumentDBServiceTest {
  private docModel = model(GDocument.name, GDocumentSchema)

  public docDBService = new GDocumentDBService(this.docModel)
}
