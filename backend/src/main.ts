import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true
  })

  app.setGlobalPrefix('api')
  app.set('trust proxy', 1)

  app.useBodyParser('json', { limit: '25MB' })
  app.use(cookieParser())

  // allow cors, reflect the request origin
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true
  })

  // swagger
  const config = new DocumentBuilder()
    .setTitle('REST-ful API')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT
  await app.listen(port)

  console.log(`🎉 服务器已启动: http://localhost:${port}`)
  console.log(`📚 API文档地址: http://localhost:${port}/api/docs`)
}

bootstrap().catch(err => {
  console.error('❌ 服务器启动失败:', err)
  process.exit(1)
})
