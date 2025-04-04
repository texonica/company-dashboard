import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';

interface AIAssistantProps {
  systemMessage?: string;
  placeholder?: string;
  model?: string;
  initialMessages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
}

export function AIAssistant({
  systemMessage = 'You are a helpful assistant for Texonica Dashboard users.',
  placeholder = 'Ask a question...',
  model = 'gpt-3.5-turbo',
  initialMessages = [],
}: AIAssistantProps) {
  const [input, setInput] = useState('');
  const { messages, setMessages, sendMessage, clearMessages, isLoading } = useOpenAI();
  
  // Set initial messages if provided
  useEffect(() => {
    if (initialMessages.length > 0) {
      // This will only run once on component mount
      setMessages([...initialMessages]);
    }
    // We only want this to run once on mount, initialMessages are not expected to change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit empty messages or while loading
    if (!input.trim() || isLoading) return;
    
    try {
      await sendMessage(input, {
        systemMessage,
        model,
        temperature: 0.7,
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="mb-4 max-h-80 overflow-y-auto space-y-4">
        {messages.filter(m => m.role !== 'system').map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-8' 
                : 'bg-gray-100 mr-8'
            }`}
          >
            <div className="font-semibold text-xs text-gray-500 mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        
        {isLoading && (
          <div className="p-3 rounded-lg bg-gray-100 mr-8">
            <div className="font-semibold text-xs text-gray-500 mb-1">
              Assistant
            </div>
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={clearMessages}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          title="Clear conversation"
          disabled={isLoading || messages.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
        
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 