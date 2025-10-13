import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextType = {
    model?: string;
    prompt: string;
    temperature?: number;
    instructions?: string;
    maxTokens?: number;
    prevResponseId: string | undefined;
};

export const llmClient = {
    async generateText({ model = 'gpt-4o-mini', prompt, temperature = 0.2, instructions = '', maxTokens = 100, prevResponseId }: GenerateTextType) {
        const response = await client.responses.create({
            model,
            input: prompt,
            temperature,
            instructions,
            max_output_tokens: maxTokens,
            previous_response_id: prevResponseId,
        });

        return {
            id: response.id,
            message: response.output_text,
        };
    },
};
