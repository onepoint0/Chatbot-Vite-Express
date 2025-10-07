import { chatRepository } from '../repositories/chat.repository';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';
import template from '../prompts/chatbot.txt';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'WonderWorld.md'), 'utf-8');
const instructions = template.replace('{{parkInfo}}', parkInfo);

type chatResponse = {
    id: string;
    message: string;
};

export const chatService = {
    async sendMessage(prompt: string, conversationId: string, maxOutput: number): Promise<chatResponse> {
        const response = await client.responses.create({
            model: 'gpt-4o-mini',
            input: prompt,
            instructions,
            temperature: 0.2,
            max_output_tokens: maxOutput,
            previous_response_id: chatRepository.getLastResponseId(conversationId),
        });

        chatRepository.setLastResponseId(conversationId, response.id);

        console.log('[api/chat] response = ', response.output_text);

        return {
            id: response.id,
            message: response.output_text,
        };
    },
};
