import ChatProductCard from './ChatProductCard.jsx';

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
          isAssistant
            ? 'bg-sage-100 text-sage-900'
            : 'bg-sage-700 text-white'
        }`}
      >
        <p className="mb-2">{message.content}</p>

        {isAssistant && message.results && message.results.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold text-sage-700">Recommendations:</p>
            {message.results.map((product, idx) => (
              <ChatProductCard
                key={idx}
                product={product}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
