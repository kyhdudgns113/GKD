import {Body, Controller, Get, Headers, Post} from '@nestjs/common'
import {AdminService} from './admin.service'
import {LogInDataType, SignUpDataType} from 'src/common/types'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // POST AREA:
  @Post(`/logIn`)
  async logIn(@Body() data: LogInDataType) {
    const {ok, body, errObj, jwtFromServer} = await this.adminService.logIn(data)
    return {ok, body, errObj, jwtFromServer}
  }
  @Post(`/signUp`)
  async signUp(@Body() data: SignUpDataType) {
    const {ok, body, errObj} = await this.adminService.signUp(data)
    return {ok, body, errObj}
  }

  // GET AREA:

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
}
