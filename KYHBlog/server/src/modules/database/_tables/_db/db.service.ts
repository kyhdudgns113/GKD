import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common'
import {mysqlHost, mysqlID, mysqlPW, mysqlDB, mysqlTestDB, mysqlTestPW, mysqlTestID, mysqlTestHost, mysqlTestPort, mysqlPort} from '@secret'

import * as mysql from 'mysql2/promise'

@Injectable()
export class DBService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool
  private isTest: boolean

  constructor(isTest?: boolean) {
    this.isTest = isTest ?? false

    if (isTest) {
      this.pool = mysql.createPool({
        host: mysqlTestHost,
        user: mysqlTestID,
        password: mysqlTestPW,
        database: mysqlTestDB,
        port: mysqlTestPort,
        waitForConnections: true,
        connectionLimit: 10, // 동시에 열 수 있는 연결 수
        queueLimit: 0, // 대기열 제한 (0 = 무제한)
        multipleStatements: true
      })
    }
  }

  async onModuleInit() {
    if (!this.isTest) {
      this.pool = mysql.createPool({
        host: mysqlHost,
        user: mysqlID,
        password: mysqlPW,
        database: mysqlDB,
        port: mysqlPort,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
      })
    }

    // 풀 연결 테스트
    await this.pool.getConnection().then(conn => conn.release())
    console.log('\n  DB pool created & connected  \n')
  }

  async onModuleDestroy() {
    await this.pool.end()
    console.log('\n  DB pool closed  \n')
  }

  /**
   * 풀 자체 반환
   */
  getPool(): mysql.Pool {
    return this.pool
  }

  /**
   * 커넥션 1개 얻기
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    return await this.pool.getConnection()
  }
}
