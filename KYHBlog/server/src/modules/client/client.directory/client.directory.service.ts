import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from 'src/common/types'
import {ClientDirPortService} from '@module/database'
import * as U from '@common/utils'
import * as HTTP from '@httpDataTypes'

@Injectable()
export class ClientDirectoryService {
  constructor(private readonly portService: ClientDirPortService) {}

  // POST AREA:

  async addDirectory(jwtPayload: JwtPayloadType, data: HTTP.AddDirectoryType) {
    /**
     * parentDirOId 디렉토리에 dirName 이라는 디렉토리를 추가한다
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.addDirectory(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async addFile(jwtPayload: JwtPayloadType, data: HTTP.AddFileType) {
    /**
     * dirOId 디렉토리에 fileName 이라는 파일을 추가한다
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // PUT AREA:

  async moveDirectory(jwtPayload: JwtPayloadType, data: HTTP.MoveDirectoryType) {
    /**
     * moveDirOId 디렉토리를 parentDirOId 디렉토리의 dirIdx 번째 인덱스로 이동한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.moveDirectory(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async moveFile(jwtPayload: JwtPayloadType, data: HTTP.MoveFileType) {
    /**
     * moveFileOId 파일을 moveDirOId 디렉토리의 dirIdx 번째 인덱스로 이동한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadDirectory(dirOId: string) {
    /**
     * dirOId 디렉토리와 그 자식파일행의 정보를 읽어온다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.loadDirectory(dirOId)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadRootDirectory() {
    const where = `/client/directory/loadRootDirectory`
    /**
     * 루트 디렉토리의 정보를 요청한다.
     */
    try {
      const {rootDirOId, extraDirs, extraFileRows} = await this.portService.loadRootDirectory()

      return {ok: true, body: {rootDirOId, extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
