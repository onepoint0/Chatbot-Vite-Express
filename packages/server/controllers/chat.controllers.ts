import z from 'zod';
import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required')
        .max(1000, 'Prompt is too long - max 1000 characters'),
    conversationId: z.uuid(),
});

export const chatController = {
    async sendMessage(req: Request, res: Response) {
        console.log('[api/chat] req.body ', req.body);

        const parseResult = chatSchema.safeParse(req.body);

        if (!parseResult.success)
            res.status(400).json(parseResult.error.format());

        try {
            const { prompt, conversationId } = req.body;
            const maxOutput = 50;

            const response = await chatService.sendMessage(
                prompt,
                conversationId,
                maxOutput
            );

            res.json({ message: response.message });
        } catch (error) {
            res.status(400).json({ message: 'Failed to generate a response.' });
        }
    },
};
