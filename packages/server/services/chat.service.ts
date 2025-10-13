import { chatRepository } from '../repositories/chat.repository';
import path from 'path';
import fs from 'fs';
import template from '../prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'WonderWorld.md'), 'utf-8');
const instructions = template.replace('{{parkInfo}}', parkInfo);

type chatResponse = {
    id: string;
    message: string;
};

export const chatService = {
    async sendMessage(prompt: string, conversationId: string): Promise<chatResponse> {
        const prevResponseId = chatRepository.getLastResponseId(conversationId);

        const response = await llmClient.generateText({ prompt, instructions, prevResponseId });

        chatRepository.setLastResponseId(conversationId, response.id);

        console.log('[api/chat] response = ', response);

        return response;
    },
};
