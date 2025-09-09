import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ReviewService {
    private readonly apiKey: string;
    private readonly baseURL: string;

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('ARK_API_KEY');
        this.baseURL = 'https://ark.cn-beijing.volces.com/api/v3';
    }

    /**
     * 将文件转换为Base64编码的数据URL
     */
    private encodeFileToBase64(file: Express.Multer.File): string {
        const base64Data = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        return `data:${mimeType};base64,${base64Data}`;
    }

    async review(file: Express.Multer.File): Promise<string> {
        // 将上传的文件转换为Base64格式
        const base64ImageUrl = this.encodeFileToBase64(file);

        try {
            // 直接使用 axios 调用方舟 API
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: 'doubao-seed-1-6-vision-250815',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: base64ImageUrl
                                    }
                                },
                                {
                                    type: 'text',
                                    text: '你是一位阅卷老师，这是一张学生的卷子，请帮我批阅。输出的格式如下：\n' +
                                        '[{\n' +
                                        '  "id": "题号",\n' +
                                        '  "result": true, // true or false\n' +
                                        '  "question": "question", // 如果是选择题，请将选项也包括在question中\n' +
                                        '  "answer": "answer", // 学生的手写答案\n' +
                                        '  "correctAnswer": "correctAnswer" // // 正确答案\n' +
                                        '}]'
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const choice = response.data.choices[0];
            return choice.message.content;
        } catch (error) {
            // 更详细的错误处理
            console.error('调用方舟API失败:', error.response?.data || error.message);
            throw new Error(`API调用失败: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}