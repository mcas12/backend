import { Module } from '@nestjs/common'
import { ReviewController } from '@src/review/review.controller'
import { ReviewService } from '@src/review/review.service'
@Module({
    controllers: [ReviewController],
    providers:[ReviewService]
})
export class ReviewModule {}