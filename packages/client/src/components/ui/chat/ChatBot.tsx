import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

type ChatResponse = {
    message: string;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

const ChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async ({ prompt }: ChatFormData) => {
        console.log('on submit, prompt ', prompt);
        try {
            setError('');
            setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

            popAudio.play();

            setIsBotTyping(true);

            const { data } = await axios.post<ChatResponse>('/api/chat', {
                prompt,
                conversationId: conversationId.current,
            });

            console.log('returned from axios = ', data);

            setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
            notificationAudio.play();
        } catch (err) {
            console.log('/api/chat error ', err);
            setError('Something went wrong, please try again!');
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full md:max-w-5xl m-auto">
            <div className="flex flex-col flex-1 gap-2 mb-10 overflow-y-auto">
                <ChatMessages messages={messages} />
                {isBotTyping && <TypingIndicator />}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <ChatInput onSubmit={onSubmit} />
        </div>
    );
};

export default ChatBot;
