import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

// Message type definition
export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Response type from OpenAI
export type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * API call to send a chat request to OpenAI
 */
async function sendChatRequest(
  url: string, 
  { arg }: { arg: { 
    messages: Message[], 
    model?: string, 
    temperature?: number,
    max_tokens?: number 
  }}
): Promise<OpenAIResponse> {
  const response = await fetch('/api/openai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error calling OpenAI API');
  }
  
  return response.json();
}

/**
 * React hook for using OpenAI in components
 */
export function useOpenAI() {
  // State to store conversation history
  const [messages, setMessages] = useState<Message[]>([]);
  
  // SWR mutation hook for API calls
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    '/api/openai/chat',
    sendChatRequest
  );
  
  /**
   * Send a message to OpenAI and add it to the conversation
   */
  const sendMessage = async (
    content: string, 
    options: { 
      model?: string, 
      temperature?: number,
      max_tokens?: number,
      systemMessage?: string
    } = {}
  ) => {
    // Create a copy of messages to work with
    const newMessages = [...messages];
    
    // Add system message if provided and not already present
    if (options.systemMessage && !messages.some(m => m.role === 'system')) {
      newMessages.unshift({ role: 'system', content: options.systemMessage });
    }
    
    // Add user message
    newMessages.push({ role: 'user', content });
    setMessages(newMessages);
    
    try {
      // Send request to OpenAI
      const response = await trigger({
        messages: newMessages,
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
      });
      
      // Add assistant response to messages
      const assistantMessage = response.choices[0]?.message;
      if (assistantMessage) {
        setMessages([...newMessages, assistantMessage]);
      }
      
      return response;
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      throw error;
    }
  };
  
  /**
   * Clear conversation history
   */
  const clearMessages = () => {
    setMessages([]);
    reset();
  };
  
  return {
    messages,
    setMessages,
    sendMessage,
    clearMessages,
    isLoading: isMutating,
    error,
    data,
  };
} 