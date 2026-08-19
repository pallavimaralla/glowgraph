import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ChatMessage from './ChatMessage.jsx';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, error, send } = useChat();
  const { user, idToken } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await send(input, idToken);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-sage-700 hover:bg-sage-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition z-40"
        title="Chat with Verrà"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-32px)] bg-white rounded-lg shadow-xl flex flex-col z-40 h-[600px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-sage-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">Verrà Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-sage-600 p-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-sage-600 py-8">
                <p className="mb-2">Hi! 👋</p>
                <p className="text-sm">
                  Describe what you're looking for in natural language.
                </p>
                <p className="text-sm">E.g., "something for dark spots under $30"</p>
              </div>
            )}

            {messages.map((message, idx) => (
              <ChatMessage key={idx} message={message} />
            ))}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-sage-200 p-4 space-y-2">
            {!user && (
              <p className="text-xs text-sage-600">
                Log in to add items to cart from chat
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 border border-sage-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-sage-700 hover:bg-sage-800 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
