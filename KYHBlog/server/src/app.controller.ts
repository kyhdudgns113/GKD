import {Body, Controller, Get, Headers, Param, Post} from '@nestjs/common'

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/')
  async getHello() {
    return 'yes'
  }
}
