import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env
  ['dd8067c8-561c-4322-be0a-4a9b042b457f'],
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

// Image input:
async function main() {
  const response = await openai.chat.completions.create({
    apiKey: process.env['dd8067c8-561c-4322-be0a-4a9b042b457'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: 'https://ark-project.tos-cn-beijing.ivolces.com/images/view.jpeg',
            },
          },
          { type: 'text', text: '这是哪里？' },
        ],
      },
    ],
    model: '{TEMPLATE_ENDPOINT_ID}',
  });

  console.log(response.choices[0]);
}

main();