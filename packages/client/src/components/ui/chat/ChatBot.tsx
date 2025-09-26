import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
    message: string;
};

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

            setIsBotTyping(true);

            const { data } = await axios.post<ChatResponse>('/api/chat', {
                prompt,
                conversationId: conversationId.current,
            });

            console.log('returned from axios = ', data);

            setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
        } catch (err) {
            console.log('/api/chat error ', err);
            setError('Something went wrong, please try again!');
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
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
