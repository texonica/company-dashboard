import { NextResponse } from 'next/server';
import { PaymentSource } from '@/lib/types/payments';
import { createManualClientMapping } from '@/lib/mappers/client-mapper';

export async function POST(req: Request) {
  try {
    const { senderId, clientId, paymentSource } = await req.json();
    
    if (!senderId || !clientId || !paymentSource) {
      return NextResponse.json(
        { error: 'Missing required fields: senderId, clientId, paymentSource' },
        { status: 400 }
      );
    }
    
    // Validate payment source
    if (!Object.values(PaymentSource).includes(paymentSource as PaymentSource)) {
      return NextResponse.json(
        { error: 'Invalid payment source' },
        { status: 400 }
      );
    }
    
    // Create manual mapping
    await createManualClientMapping(
      senderId,
      clientId,
      paymentSource as PaymentSource
    );
    
    return NextResponse.json({
      success: true,
      message: 'Client mapping created successfully',
      mapping: {
        senderId,
        clientId,
        paymentSource
      }
    });
  } catch (error: any) {
    console.error('Error creating client mapping:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 