import { FaArrowUp } from 'react-icons/fa';
import { Button } from './button';

const ChatBot = () => {
    return (
        <div className="flex flex-col items-end gap-2 p-4 border-2 rounded-3xl">
            <textarea
                className="w-full border-0 focus:outline-0 resize-none"
                placeholder="Ask anything"
                maxLength={1000}
            />
            <Button className="rounded-full w-9 h-9">
                <FaArrowUp />
            </Button>
        </div>
    );
};

export default ChatBot;
