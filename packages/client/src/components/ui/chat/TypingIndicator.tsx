const TypingIndicator = () => {
    return (
        <div className="px-4 py-2 rounded-3xl flex self-start gap-2 bg-gray-200">
            <Dot />
            <Dot className={'[animation-delay:0.2s]'} />
            <Dot className={'[animation-delay:0.2s]'} />
        </div>
    );
};

type DotProperties = {
    className?: string;
};

const Dot = ({ className }: DotProperties) => <div className={`h-2 w-2 rounded-full bg-gray-800 animate-pulse ${className}`}></div>;

export default TypingIndicator;
