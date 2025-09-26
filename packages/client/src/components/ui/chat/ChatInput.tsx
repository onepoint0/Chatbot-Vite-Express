import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../button';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
    prompt: string;
};

type Props = {
    onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
    const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

    const submit = handleSubmit((data) => {
        reset({ prompt: '' });
        onSubmit(data);
    });

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <form onSubmit={submit} onKeyDown={onKeyDown} className="flex flex-col items-end gap-2 p-4 border-2 rounded-3xl">
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
    );
};

export default ChatInput;
