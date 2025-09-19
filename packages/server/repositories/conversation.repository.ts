const conversations = new Map<string, string>();

export const conversationRepository = {
    getLastResponseId: function (conversationId: string) {
        return conversations.get(conversationId);
    },
    setLastResponseId: function (conversationId: string, responseId: string) {
        conversations.set(conversationId, responseId);
    },
};
