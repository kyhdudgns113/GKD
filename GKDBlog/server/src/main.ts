import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface'
import {clientIP, serverPort} from './common/secret'
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS 설정
  const corsOptions: CorsOptions = {
    origin: [clientIP],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }
  app.enableCors(corsOptions)

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('GKDBlog API')
    .setDescription('GKDBlog API Description')
    .setVersion('1.0') // ::
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // 서버 실행
  await app.listen(serverPort)
}
bootstrap()
