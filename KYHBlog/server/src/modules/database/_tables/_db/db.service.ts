import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common'
import {mysqlHost, mysqlID, mysqlPW, mysqlDB, mysqlTestDB, mysqlTestPW, mysqlTestID, mysqlTestHost} from '@secrets'

import * as mysql from 'mysql2/promise'

@Injectable()
export class DBService implements OnModuleInit, OnModuleDestroy {
  private connection: mysql.Connection
  private isTest: boolean

  constructor(isTest?: boolean) {
    this.isTest = isTest

    if (isTest) {
      mysql
        .createConnection({
          host: mysqlTestHost,
          user: mysqlTestID,
          password: mysqlTestPW,
          database: mysqlTestDB
        })
        .then(res => {
          this.connection = res
        })
        .catch(err => {
          console.log(`    테스트용 DB 연결에 실패했습니다`)
          throw err
        })
    }
  }

  async onModuleInit() {
    if (!this.isTest) {
      this.connection = await mysql.createConnection({
        host: mysqlHost,
        user: mysqlID,
        password: mysqlPW,
        database: mysqlDB
      })
    }
    console.log('\n  DB connected  \n')
  }

  async onModuleDestroy() {
    await this.connection.end()
    console.log('\n  DB disconnected  \n')
  }

  getConnection() {
    return this.connection
  }
}
