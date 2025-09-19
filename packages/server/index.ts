import dotenv from 'dotenv';
import OpenAI from 'openai';
import express from 'express';
import type { Request, Response } from 'express';

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

app.post('/api/chat', async (req: Request, res: Response) => {
    console.log('[api/chat] req.body ', req.body);
    const { prompt } = req.body;
    const maxOutput = 50;
    const response = await client.responses.create({
        model: 'gpt-4o-mini',
        input: prompt,
        temperature: 0.2,
        max_output_tokens: maxOutput,
    });
    console.log('[api/chat] response = ', response.output_text);
    res.json({ message: response.output_text });
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
