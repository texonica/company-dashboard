import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, updateRecord, fetchRecord } from '@/lib/api/aitable';

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    if (!AITABLE_CONFIG.PAYMENTS_TABLE_ID) {
      return NextResponse.json(
        { error: 'AITABLE_PAYMENTS_TABLE_ID is not configured' },
        { status: 500 }
      );
    }
    
    // Check if payment exists
    const existingPayment = await fetchRecord(AITABLE_CONFIG.PAYMENTS_TABLE_ID, id);
    
    if (!existingPayment) {
      return NextResponse.json(
        { error: `Payment with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Get update data from request body
    const updateData = await request.json();
    
    // Update the record
    await updateRecord(AITABLE_CONFIG.PAYMENTS_TABLE_ID, id, { fields: updateData });
    
    return NextResponse.json({
      success: true,
      message: 'Payment updated successfully',
      paymentId: id
    });
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 