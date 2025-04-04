import { NextRequest, NextResponse } from 'next/server';
import { geminiClient } from '@/lib/api/gemini';

export async function POST(request: NextRequest) {
  try {
    // Validate the request
    const body = await request.json();
    
    // Basic validation
    if (!body.message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Extract parameters
    const { message, history = [], modelName } = body;
    
    // Start or continue chat session
    const chat = geminiClient.startChat(modelName, history);
    
    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    // Return the response
    return NextResponse.json({ 
      response,
      // Return updated history for client to maintain state
      history: [
        ...history,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: response }] }
      ]
    });
  } catch (error: any) {
    console.error('Error in Gemini Chat API route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

// Optionally add rate limiting or additional security measures here
export const config = {
  runtime: 'edge',
}; 