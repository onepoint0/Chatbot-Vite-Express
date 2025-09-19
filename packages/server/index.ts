import dotenv from 'dotenv';
import OpenAI from 'openai';
import express from 'express';
import z from 'zod';
import type { Request, Response } from 'express';
import { conversationRepository } from './repositories/conversation.repository';

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('hello world!');
});

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required')
        .max(1000, 'Prompt is too long - max 1000 characters'),
    conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
    console.log('[api/chat] req.body ', req.body);

    const parseResult = chatSchema.safeParse(req.body);

    if (!parseResult.success) res.status(400).json(parseResult.error.format());

    try {
        const { prompt, conversationId } = req.body;
        const maxOutput = 50;

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
        res.json({ message: response.output_text });
    } catch (error) {
        res.status(400).json({ message: 'Failed to generate a response.' });
    }
});

app.post('/api/hellopost', (req: Request, res: Response) => {
    res.json({ message: 'hello world!' });
});

app.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'hello world!' });
});

app.listen(port, () => {
    console.log(`server is running in http://localhost:${port}`);
});
