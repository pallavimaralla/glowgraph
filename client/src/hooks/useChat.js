import { useState, useCallback } from 'react';
import { sendChatMessage } from '../api/chat.api.js';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(
    async (userMessage, token = null) => {
      try {
        setError(null);
        setLoading(true);

        const response = await sendChatMessage(userMessage, sessionId, token);

        // Add user message
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
          },
        ]);

        // Add assistant response
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.response,
            results: response.results,
            timestamp: new Date(),
          },
        ]);

        // Set session ID from response
        if (response.sessionId && !sessionId) {
          setSessionId(response.sessionId);
        }

        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Chat failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  }, []);

  return {
    messages,
    sessionId,
    loading,
    error,
    send,
    reset,
  };
}
