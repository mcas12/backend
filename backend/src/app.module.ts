import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { APP_FILTER, REQUEST } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { AllExceptionsFilter } from '@src/common/errorFilter'
import { ReviewModule } from '@src/review/review.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ReviewModule

  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: REQUEST,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
