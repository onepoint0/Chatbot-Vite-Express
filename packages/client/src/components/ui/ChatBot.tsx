import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { Button } from './button';

type FormData = {
    prompt: string;
};

type ChatResponse = {
    message: string;
};

type Message = {
    content: string;
    role: 'user' | 'bot';
};

const ChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = async ({ prompt }: FormData) => {
        console.log('on submit, prompt ', prompt);
        try {
            reset({ prompt: '' });
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

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const onCopyMessage = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const selection = window.getSelection()?.toString().trim();
        e.preventDefault();
        if (selection) e.clipboardData.setData('text/plain', selection);
    };
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 gap-2 mb-10 overflow-y-auto">
                {messages.map((m: Message, idx) => (
                    <div
                        key={idx}
                        onCopy={onCopyMessage}
                        ref={idx === messages.length - 1 ? lastMessageRef : null}
                        className={`px-4 py-2 rounded-3xl ${m.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
                    >
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="px-4 py-2 rounded-3xl flex self-start gap-2 bg-gray-200">
                        <div className="h-2 w-2 rounded-full bg-gray-800 animate-pulse"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={onKeyDown} className="flex flex-col items-end gap-2 p-4 border-2 rounded-3xl">
                <textarea
                    {...register('prompt', {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                    })}
                    autoFocus
                    className="w-full border-0 focus:outline-0 resize-none"
                    placeholder="Ask anything"
                    maxLength={1000}
                />
                <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
                    <FaArrowUp />
                </Button>
            </form>
        </div>
    );
};

export default ChatBot;
