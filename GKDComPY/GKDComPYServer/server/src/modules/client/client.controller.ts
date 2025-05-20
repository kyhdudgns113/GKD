import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {LogInDataType} from 'src/common/types'
import {ClientService} from './client.service'
import {CheckJwtValidationGuard} from 'src/common/guards'

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // POST AREA:
  @Post(`/logIn`)
  async logIn(@Body() data: LogInDataType) {
    const {ok, body, errObj, jwtFromServer} = await this.clientService.logIn(data)
    return {ok, body, errObj, jwtFromServer}
  }

  // GET AREA:
  @Get('/getUserCommInfo/:uOId')
  @UseGuards(CheckJwtValidationGuard)
  async getUserCommInfo(@Headers() headers: any, @Param('uOId') uOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, errObj} = await this.clientService.getUserCommInfo(jwtPayload, uOId)
    return {ok, body, errObj, jwtFromServer}
  }
  /**
   * 어떤놈이 이걸 호출한 줄 알고 JWT 를 넘겨줌? \
   * 심지어 guard 도 안써야 하는 곳이라서 JWT 받지도 않았음. \
   * 제대로 된 요청이었으면 gkdJwt 를 거쳤어서 이미 토큰 받았음 \
   * 즉, 여기서는 그냥 저것만 리턴하면 됨.
   */
  @Get('/refreshToken')
  async refreshToken(@Headers() headers: any) {
    // 다시 언급하지만 guard 쓰면 안됨.
    // 시작 페이지에서도 이걸 호출하기 때문
    // 그 때는 JWT 가 당연히 없을거아냐.
    return {
      ok: true,
      body: {},
      errObj: {},
      jwtFromServer: headers.jwtFromServer
    }
  }

  // 기존 대전기록에서 memOId 없는 애들에 대하여
  // 클럽 멤버와 일치하는 닉네임 있으면 memOId 매칭
  // 없으면 어쩔 수 없고...
  @Get('/setAllMemOId/:commOId')
  @UseGuards(CheckJwtValidationGuard)
  async setAllMemOId(@Headers() headers: any, @Param('commOId') commOId: string) {
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.clientService.setAllMemOId(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }

  @Get('/onClickQuestion/:commOId')
  @UseGuards(CheckJwtValidationGuard)
  async onClickQuestion(@Headers() headers: any, @Param('commOId') commOId: string) {
    console.log('  onClickQuestion')
    const {jwtPayload, jwtFromServer} = headers
    const {ok, body, errObj} = await this.clientService.onClickQuestion(jwtPayload, commOId)
    return {ok, body, errObj, jwtFromServer}
  }
}
