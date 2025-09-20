import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controllers';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('hello world!');
});

router.post('/api/chat', chatController.sendMessage);

router.post('/api/hellopost', (req: Request, res: Response) => {
    res.json({ message: 'hello world!' });
});

router.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'hello world!' });
});

export default router;
