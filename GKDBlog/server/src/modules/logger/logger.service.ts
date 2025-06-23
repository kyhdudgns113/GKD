import {Injectable} from '@nestjs/common'
import {LoggerPortService} from '../database/ports/loggerPort/loggerPort.service'

@Injectable()
export class LoggerService {
  constructor(private readonly portService: LoggerPortService) {}

  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createLog(where: string, uOId: string, gkdLog: string, gkdStatus: Object, logInId?: string) {
    try {
      if (logInId) {
        await this.portService.createLog(where, uOId, gkdLog, gkdStatus, logInId)
      } // ::
      else {
        await this.portService.createLog(where, uOId, gkdLog, gkdStatus)
      }
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkd) {
        console.log(`${where} 에서 로그 쓰는데 에러가 났어요`)
        Object.keys(errObj.gkd).forEach(key => {
          console.log(`    ${key}: ${errObj.gkd[key]}`)
        })
      } // ::
      else {
        console.log(`${where} 에서 로그 쓰는데 치명적인 에러가 났어요`)
        Object.keys(errObj).forEach(key => {
          console.log(`    ${key}: ${errObj[key]}`)
        })
      }
    }
  }

  async createErrLog(where: string, uOId: string, errObj: any, logInId?: string) {
    try {
      if (errObj.gkd) {
        if (logInId) {
          await this.createGKDErr(where, uOId, errObj.gkdErr, errObj.gkdStatus, logInId)
        } // ::
        else {
          await this.createGKDErr(where, uOId, errObj.gkdErr, errObj.gkdStatus)
        }
      } // ::
      else {
        if (logInId) {
          await this.createGKDErrObj(where, uOId, errObj, logInId)
        } // ::
        else {
          await this.createGKDErrObj(where, uOId, errObj)
        }
      }
      // ::
    } catch (errObj) {
      // ::
      // DO NOTHING:
      // ::
    }
  }
  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createGKDErr(where: string, uOId: string, gkdErr: string, gkdStatus: Object, logInId?: string) {
    try {
      if (logInId) {
        await this.portService.createGKDErr(where, uOId, gkdErr, gkdStatus, logInId)
      } // ::
      else {
        await this.portService.createGKDErr(where, uOId, gkdErr, gkdStatus)
      }
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkd) {
        console.log(`${where} 에서 GKDErr 쓰는데 에러가 났어요`)
        Object.keys(errObj.gkd).forEach(key => {
          console.log(`    ${key}: ${errObj.gkd[key]}`)
        })
      } // ::
      else {
        console.log(`${where} 에서 GKDErr 쓰는데 치명적인 에러가 났어요`)
        Object.keys(errObj).forEach(key => {
          console.log(`    ${key}: ${errObj[key]}`)
        })
      }
    }
  }
  /**
   * try-catch 문에 넣되, catch 처리는 외부에서 별도로 안해도 된다.
   */
  async createGKDErrObj(where: string, uOId: string, gkdErrObj: Object, logInId?: string) {
    try {
      if (logInId) {
        await this.portService.createGKDErrObj(where, uOId, gkdErrObj, logInId)
      } // ::
      else {
        await this.portService.createGKDErrObj(where, uOId, gkdErrObj)
      }
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkd) {
        console.log(`${where} 에서 GKDErrObj 쓰는데 에러가 났어요`)
        Object.keys(errObj.gkd).forEach(key => {
          console.log(`    ${key}: ${errObj.gkd[key]}`)
        })
      } // ::
      else {
        console.log(`${where} 에서 GKDErrObj 쓰는데 치명적인 에러가 났어요`)
        Object.keys(errObj).forEach(key => {
          console.log(`    ${key}: ${errObj[key]}`)
        })
      }
    }
  }
}
