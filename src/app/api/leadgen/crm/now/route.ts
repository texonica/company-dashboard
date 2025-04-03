import { NextResponse } from 'next/server';
import { fetchTableRecords } from '@/lib/api/aitable';

// CRM table ID from AITable
const CRM_TABLE_ID = process.env.AITABLE_CRM_TABLE_ID || 'dstDfpcYqF2nW6azmR';

export async function GET() {
  try {
    // Fetch all CRM records from AITable
    const records = await fetchTableRecords(CRM_TABLE_ID);
    
    // Transform records to have an id property (mapping recordId to id)
    const transformedRecords = records.map(record => ({
      id: record.recordId, // Map recordId to id
      fields: record.fields
    }));
    
    // Get end of current week (Saturday 23:59:59)
    const now = new Date();
    const endOfWeek = new Date(now);
    const daysToSaturday = 6 - now.getDay(); // 6 is Saturday
    endOfWeek.setDate(now.getDate() + daysToSaturday);
    endOfWeek.setHours(23, 59, 59, 999);
    const endOfWeekTimestamp = endOfWeek.getTime();
    
    // Filter for records with NextAction field that is either:
    // 1. In the past (earlier than current time), or
    // 2. Before or at the end of the current week
    const nowRecords = transformedRecords.filter(record => {
      const nextActionTimestamp = record.fields.NextAction;
      
      // If NextAction exists and is a valid timestamp
      if (nextActionTimestamp && typeof nextActionTimestamp === 'number') {
        // Check if NextAction is in the past or before the end of the week
        return nextActionTimestamp <= endOfWeekTimestamp;
      }
      
      return false;
    });
    
    // Sort records by NextAction in ascending order (earliest first)
    const sortedRecords = [...nowRecords].sort((a, b) => {
      const dateA = a.fields.NextAction || 0;
      const dateB = b.fields.NextAction || 0;
      
      // Sort in ascending order (earliest first)
      return dateA - dateB;
    });
    
    // Return the sorted records
    return NextResponse.json({ 
      success: true,
      records: sortedRecords
    });
  } catch (error) {
    console.error('Error fetching Now CRM data:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch Now CRM data'
      },
      { status: 500 }
    );
  }
} 