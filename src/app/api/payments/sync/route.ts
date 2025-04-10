import { NextResponse } from 'next/server';
import { syncSubscriptionsToAITable } from '@/lib/api/chargebee-sync';

export async function POST() {
  try {
    const result = await syncSubscriptionsToAITable();
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Error syncing subscriptions:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 