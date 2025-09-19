import { conversationRepository } from '../repositories/conversation.repository';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type chatResponse = {
    id: string;
    message: string;
};

export const chatService = {
    async sendMessage(
        prompt: string,
        conversationId: string,
        maxOutput: number
    ): Promise<chatResponse> {
        const response = await client.responses.create({
            model: 'gpt-4o-mini',
            input: prompt,
            temperature: 0.2,
            max_output_tokens: maxOutput,
            previous_response_id:
                conversationRepository.getLastResponseId(conversationId),
        });

        conversationRepository.setLastResponseId(conversationId, response.id);

        console.log('[api/chat] response = ', response.output_text);

        return {
            id: response.id,
            message: response.output_text,
        };
    },
};
