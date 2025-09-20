import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { Button } from './button';

type FormData = {
    prompt: string;
};

type ChatResponse = {
    message: string;
};

const ChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const [messages, setMessages] = useState<string[]>([]);

    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = async ({ prompt }: FormData) => {
        console.log('on submit, prompt ', prompt);
        reset();
        setMessages((prev) => [...prev, prompt]);

        const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
        });
        console.log('returned from axios = ', data);

        setMessages((prev) => [...prev, data.message]);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div>
            <div>
                {messages.map((m, idx) => (
                    <p key={idx}>{m}</p>
                ))}
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={onKeyDown}
                className="flex flex-col items-end gap-2 p-4 border-2 rounded-3xl"
            >
                <textarea
                    {...register('prompt', {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                    })}
                    className="w-full border-0 focus:outline-0 resize-none"
                    placeholder="Ask anything"
                    maxLength={1000}
                />
                <Button
                    disabled={!formState.isValid}
                    className="rounded-full w-9 h-9"
                >
                    <FaArrowUp />
                </Button>
            </form>
        </div>
    );
};

export default ChatBot;
