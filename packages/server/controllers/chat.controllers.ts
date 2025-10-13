import z from 'zod';
import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
    prompt: z.string().trim().min(1, 'Prompt is required').max(1000, 'Prompt is too long - max 1000 characters'),
    conversationId: z.uuid(),
});

export const chatController = {
    async sendMessage(req: Request, res: Response) {
        console.log('[Controller api/chat] req.body ', req.body);

        const parseResult = chatSchema.safeParse(req.body);

        if (!parseResult.success) {
            console.log('[Controller api/chat] parse body failed');
            res.status(400).json(parseResult.error.format());
        }

        try {
            const { prompt, conversationId } = req.body;
            const maxOutput = 100;

            console.log('[Controller api/chat] calling chat service with prompt ', prompt);
            const response = await chatService.sendMessage(prompt, conversationId, maxOutput);
            console.log('[Controller api/chat] got response from chat service ', response);

            res.json({ message: response.message });
        } catch (error) {
            console.log('[Controller api/chat] - error ', error);
            res.status(400).json({ message: 'Failed to generate a response.' });
        }
    },
};
