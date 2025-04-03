import { NextRequest, NextResponse } from 'next/server';
import { fetchRecord, updateRecord } from '@/lib/api/aitable';

// Make sure we use the correct table ID for CRM records
const CRM_TABLE_ID = process.env.AITABLE_CRM_TABLE_ID || 'dstDfpcYqF2nW6azmR';

/**
 * GET a single CRM record by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Properly await the params object before accessing its properties
  const params = await Promise.resolve(context.params);
  const recordId = params.id;
  
  try {
    const record = await fetchRecord(CRM_TABLE_ID, recordId);
    
    if (!record) {
      return NextResponse.json({ error: 'CRM record not found' }, { status: 404 });
    }
    
    return NextResponse.json(record);
  } catch (error) {
    console.error(`Error fetching CRM record ${recordId}:`, error);
    
    if ((error as Error).message.includes('404')) {
      return NextResponse.json({ error: 'CRM record not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch CRM record' },
      { status: 500 }
    );
  }
}

/**
 * PATCH (update) a CRM record
 */
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Properly await the params object before accessing its properties
  const params = await Promise.resolve(context.params);
  const recordId = params.id;
  
  try {
    const body = await request.json();
    const { fields } = body;
    
    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }
    
    console.log(`Updating CRM record ${recordId} with fields:`, fields);
    
    const result = await updateRecord(CRM_TABLE_ID, recordId, { fields });
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error updating CRM record ${recordId}:`, error);
    
    if ((error as Error).message.includes('404')) {
      return NextResponse.json({ error: 'CRM record not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update CRM record', message: (error as Error).message },
      { status: 500 }
    );
  }
} 