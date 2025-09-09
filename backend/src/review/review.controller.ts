import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common'
import OpenAI from 'openai';
import {ReviewService} from "@src/review/review.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiOperation} from "@nestjs/swagger";



@Controller('/review')
export class ReviewController {
    private readonly openai: OpenAI

    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    @ApiOperation({
        summary: '作业批阅',
        description: '对上传的作业进行批阅，并返回批阅结果'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '上传的图片文件',
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                    description: '作业图片文件'
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async review(@UploadedFile() image: Express.Multer.File): Promise<string> {
        return this.reviewService.review(image)
    }
}