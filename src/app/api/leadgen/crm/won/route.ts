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
    
    // Filter for records with "Won" stage
    const wonRecords = transformedRecords.filter(record => 
      record.fields.Stage === 'Won'
    );
    
    // Sort records by date (FirstCall or Created) in descending order
    const sortedRecords = [...wonRecords].sort((a, b) => {
      // Use FirstCall if available, otherwise use Created
      const dateA = a.fields.FirstCall || a.fields.Created || 0;
      const dateB = b.fields.FirstCall || b.fields.Created || 0;
      
      // Sort in descending order (newest first)
      return dateB - dateA;
    });
    
    // Return the sorted records
    return NextResponse.json({ 
      success: true,
      records: sortedRecords
    });
  } catch (error) {
    console.error('Error fetching Won CRM data:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch Won CRM data'
      },
      { status: 500 }
    );
  }
} 