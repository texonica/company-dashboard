import { useState, useCallback } from 'react';

type GeminiConfig = {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
};

type ChatMessage = {
  role: 'user' | 'model' | string;
  parts: Array<{ text: string }>;
};

/**
 * Hook for interacting with the Gemini API
 * 
 * This hook provides methods for generating content and chatting
 * with the Gemini API through our secure backend endpoints.
 */
export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Generate content with Gemini
   */
  const generateContent = useCallback(async (
    prompt: string | Array<any>,
    modelName: string = 'gemini-1.5-flash',
    config?: GeminiConfig
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          modelName,
          config,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      return data.response;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Chat with Gemini
   */
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const sendChatMessage = useCallback(async (
    message: string,
    modelName: string = 'gemini-1.5-flash'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: chatHistory,
          modelName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Update chat history
      setChatHistory(data.history);
      
      return data.response;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);
  
  /**
   * Reset chat history
   */
  const resetChat = useCallback(() => {
    setChatHistory([]);
  }, []);
  
  return {
    generateContent,
    sendChatMessage,
    resetChat,
    chatHistory,
    isLoading,
    error,
  };
} 