import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface'
import {clientIP, serverPort} from './common/secret'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOptions: CorsOptions = {
    origin: [clientIP],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }
  app.enableCors(corsOptions)

  await app.listen(serverPort)
}
bootstrap()
