import { NextRequest, NextResponse } from 'next/server';
import { geminiClient } from '@/lib/api/gemini';

export async function POST(request: NextRequest) {
  try {
    // Validate the request
    const body = await request.json();
    
    // Basic validation
    if (!body.prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // Extract parameters
    const { prompt, modelName, config } = body;
    
    // Call the Gemini API
    const response = await geminiClient.generateContent(prompt, modelName, config);
    
    // Return the response
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Error in Gemini API route:', error);
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