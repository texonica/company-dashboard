import OpenAI from 'openai';
import { recordLLMUsage } from '@/lib/api/telemetry';

// Initialize the OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
});

/**
 * Get a chat completion from OpenAI
 * 
 * @param messages Array of message objects with role and content
 * @param options Configuration options for the request
 * @returns The chat completion response
 */
export async function getChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
) {
  const model = options.model || 'gpt-4o';
  
  try {
    console.time('openai_chat_completion');
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens,
    });
    console.timeEnd('openai_chat_completion');
    
    // Track token usage for telemetry
    if (response.usage) {
      const promptTokens = response.usage.prompt_tokens;
      const completionTokens = response.usage.completion_tokens;
      const cost = calculateOpenAICost(model, promptTokens, completionTokens);
      
      recordLLMUsage(
        'openai.chat',
        model,
        promptTokens,
        completionTokens,
        cost
      );
    }
    
    return response;
  } catch (error) {
    console.error('Error in OpenAI chat completion:', error);
    throw error;
  }
}

/**
 * Get text embeddings from OpenAI
 * 
 * @param input String or array of strings to get embeddings for
 * @returns The embeddings response
 */
export async function getEmbeddings(input: string | string[]) {
  const model = 'text-embedding-3-small';
  
  try {
    console.time('openai_embeddings');
    const response = await openai.embeddings.create({
      model,
      input,
    });
    console.timeEnd('openai_embeddings');
    
    // Track token usage for telemetry
    if (response.usage) {
      const promptTokens = response.usage.prompt_tokens;
      const completionTokens = 0; // Embeddings don't have completion tokens
      const cost = calculateOpenAICost(model, promptTokens, completionTokens);
      
      recordLLMUsage(
        'openai.embeddings',
        model,
        promptTokens,
        completionTokens,
        cost
      );
    }
    
    return response;
  } catch (error) {
    console.error('Error in OpenAI embeddings:', error);
    throw error;
  }
}

/**
 * Calculate the cost of an OpenAI API call based on model and token usage
 * These prices may need to be updated as OpenAI pricing changes
 */
function calculateOpenAICost(model: string, promptTokens: number, completionTokens: number): number {
  // Pricing per 1K tokens as of April 2024
  const pricing: Record<string, { promptPrice: number; completionPrice: number }> = {
    'gpt-4o': { promptPrice: 0.005, completionPrice: 0.015 },
    'gpt-4o-mini': { promptPrice: 0.00015, completionPrice: 0.0006 },
    'gpt-4': { promptPrice: 0.03, completionPrice: 0.06 },
    'gpt-3.5-turbo': { promptPrice: 0.0005, completionPrice: 0.0015 },
    'text-embedding-3-small': { promptPrice: 0.00002, completionPrice: 0 },
    'text-embedding-3-large': { promptPrice: 0.00013, completionPrice: 0 },
  };
  
  const modelPricing = pricing[model] || { promptPrice: 0.01, completionPrice: 0.01 }; // Default fallback
  
  const promptCost = (promptTokens / 1000) * modelPricing.promptPrice;
  const completionCost = (completionTokens / 1000) * modelPricing.completionPrice;
  
  return promptCost + completionCost;
} 