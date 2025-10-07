import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
    content: string;
    role: 'user' | 'bot';
};

type Props = {
    messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    const onCopyMessage = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const selection = window.getSelection()?.toString().trim();
        e.preventDefault();
        if (selection) e.clipboardData.setData('text/plain', selection);
    };

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            {messages.map((m: Message, idx) => (
                <div
                    key={idx}
                    onCopy={onCopyMessage}
                    ref={idx === messages.length - 1 ? lastMessageRef : null}
                    className={`px-4 py-2 max-w-2xl rounded-3xl ${m.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
                >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
            ))}
        </>
    );
};

export default ChatMessages;
