import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold, GenerationConfig, Content, Part } from '@google/generative-ai';

// Ensure API_KEY is only accessed on the server side
if (typeof window !== 'undefined') {
  throw new Error('Gemini API client should only be used on the server side');
}

// Get the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

/**
 * Client for the Google Generative AI API
 */
export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  /**
   * Get a specific Gemini model
   * @param modelName - The name of the model to use (e.g., "gemini-1.5-flash")
   * @returns The generative model instance
   */
  getModel(modelName: string = 'gemini-1.5-flash'): GenerativeModel {
    return this.genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Generate content using the specified model
   * @param prompt - Text prompt or an array of content parts (text/images)
   * @param modelName - The name of the model to use (defaults to gemini-1.5-flash)
   * @param config - Optional generation configuration
   * @returns The generated text response
   */
  async generateContent(
    prompt: string | Array<any>,
    modelName: string = 'gemini-1.5-flash',
    config?: {
      temperature?: number;
      topK?: number;
      topP?: number;
      maxOutputTokens?: number;
      stopSequences?: string[];
      safetySettings?: Array<{
        category: HarmCategory;
        threshold: HarmBlockThreshold;
      }>;
    }
  ): Promise<string> {
    try {
      const model = this.getModel(modelName);
      
      // Create proper configuration object
      const options: any = {};
      
      if (config) {
        if (config.temperature !== undefined ||
            config.topK !== undefined ||
            config.topP !== undefined ||
            config.maxOutputTokens !== undefined ||
            config.stopSequences !== undefined) {
          options.generationConfig = {
            temperature: config.temperature,
            topK: config.topK,
            topP: config.topP,
            maxOutputTokens: config.maxOutputTokens,
            stopSequences: config.stopSequences,
          };
        }
        
        if (config.safetySettings) {
          options.safetySettings = config.safetySettings;
        }
      }

      // Generate content with the provided config
      const result = await model.generateContent(prompt, options);

      return result.response.text();
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      throw error;
    }
  }

  /**
   * Start a chat session with the specified model
   * @param modelName - The name of the model to use (defaults to gemini-1.5-flash)
   * @param history - Optional initial chat history
   * @returns The chat session instance
   */
  startChat(modelName: string = 'gemini-1.5-flash', history: Array<{ role: string; parts: Array<Part> }> = []) {
    const model = this.getModel(modelName);
    return model.startChat({
      history: history as Content[],
    });
  }

  /**
   * Count tokens in a prompt
   * @param prompt - Text prompt to count tokens for
   * @param modelName - The name of the model to use
   * @returns The token count
   */
  async countTokens(prompt: string, modelName: string = 'gemini-1.5-flash'): Promise<number> {
    try {
      const model = this.getModel(modelName);
      const result = await model.countTokens(prompt);
      return result.totalTokens;
    } catch (error) {
      console.error('Error counting tokens:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const geminiClient = new GeminiClient();

// Export types for easier consumption
export type { HarmCategory, HarmBlockThreshold, GenerationConfig, Content, Part }; 