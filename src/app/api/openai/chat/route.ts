import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/api/openai';

/**
 * POST /api/openai/chat
 * Backend route for OpenAI chat completion requests
 * 
 * Request body:
 * {
 *   messages: [{ role: "system" | "user" | "assistant", content: string }],
 *   model?: string,
 *   temperature?: number,
 *   max_tokens?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model, temperature, max_tokens } = body;
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Validate message format
    const validRoles = ['system', 'user', 'assistant'];
    const invalidMessage = messages.find(
      (msg) => !msg.role || !validRoles.includes(msg.role) || typeof msg.content !== 'string'
    );
    
    if (invalidMessage) {
      return NextResponse.json(
        { 
          error: 'Invalid message format. Each message must have a role (system, user, or assistant) and content.',
          invalidMessage
        },
        { status: 400 }
      );
    }
    
    // Call OpenAI
    const response = await getChatCompletion(messages, {
      model,
      temperature,
      max_tokens,
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);
    
    // Handle specific error cases
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key or authentication error.' },
        { status: 401 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: error?.message || 'Error calling OpenAI' },
      { status: 500 }
    );
  }
} 