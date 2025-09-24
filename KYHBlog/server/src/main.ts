import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface'
import {clientIP, serverPort} from './common/secret'
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'

process.on('disconnect', arg => {
  console.log(`\ndisconnect: ${arg}`)
  const keyArr = Object.keys(arg)
  if (typeof arg !== 'string') {
    keyArr.forEach(key => {
      console.log(`${key}: ${arg[key]}`)
    })
  }
})

process.on('exit', arg => {
  console.log(`\nexit:  ${arg}`)
  const keyArr = Object.keys(arg)
  if (typeof arg !== 'string') {
    keyArr.forEach(key => {
      console.log(`${key}: ${arg[key]}`)
    })
  }
})

process.on('rejectionHandled', err => {
  console.error(`\nrejectionHandled:   ${err}`)
  const keyArr = Object.keys(err)
  if (typeof err !== 'string') {
    keyArr.forEach(key => {
      console.error(`${key}: ${err[key]}`)
    })
  }
})

process.on('uncaughtException', err => {
  console.error(`\nuncaughtException: ${err}`)
  const keyArr = Object.keys(err)
  if (typeof err !== 'string') {
    keyArr.forEach(key => {
      console.error(`${key}: ${err[key]}`)
    })
  }
})

process.on('uncaughtExceptionMonitor', err => {
  console.error(`\nuncaughtExceptionMonitor: ${err}`)
  const keyArr = Object.keys(err)
  if (typeof err !== 'string') {
    keyArr.forEach(key => {
      console.error(`${key}: ${err[key]}`)
    })
  }
})

process.on('unhandledRejection', err => {
  console.error(`\nunhandledRejection: ${err}`)
  const keyArr = Object.keys(err)
  if (typeof err !== 'string') {
    keyArr.forEach(key => {
      console.error(`${key}: ${err[key]}`)
    })
  }
})

async function bootstrap() {
  try {
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
      .setTitle('KYHBlog API')
      .setDescription('KYHBlog API Description')
      .setVersion('1.0') // ::
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    // 서버 실행
    await app.listen(serverPort).catch(errObj => {
      console.log(`\n\n[main.ts] listen 에서 에러 발생: ${errObj}`)

      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    })
    // ::
  } catch (errObj) {
    // ::
    console.log(`\n\n[main.ts] 에러 발생: ${errObj}`)

    Object.keys(errObj).forEach(key => {
      console.log(`   ${key}: ${errObj[key]}`)
    })

    throw errObj
  }
}
bootstrap()
