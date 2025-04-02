import { NextResponse } from 'next/server';
import { fetchTableRecords } from '@/lib/api/aitable';

// FVR Leadgen table ID from AITable
const FVR_LEADGEN_TABLE_ID = process.env.AITABLE_FVR_LEADGEN_TABLE_ID || 'dstrS0cegNHA0hQHhW';

export async function GET() {
  try {
    // Fetch FVR Leadgen records from AITable
    const records = await fetchTableRecords(FVR_LEADGEN_TABLE_ID);
    
    // Transform records to have an id property (mapping recordId to id)
    const transformedRecords = records.map(record => ({
      id: record.recordId, // Map recordId to id
      fields: record.fields
    }));
    
    // Sort records by Week (assuming Title contains the week information)
    const sortedRecords = [...transformedRecords].sort((a, b) => {
      // Extract Year:Month:Week from Title format "YYYY:M:W"
      const titleA = a.fields.Title || '';
      const titleB = b.fields.Title || '';
      
      // Split by colon to get parts
      const partsA = titleA.split(':').map(Number);
      const partsB = titleB.split(':').map(Number);
      
      // Compare year first
      if (partsA[0] !== partsB[0]) return partsB[0] - partsA[0]; // Descending by year
      
      // Then month
      if (partsA[1] !== partsB[1]) return partsB[1] - partsA[1]; // Descending by month
      
      // Then week
      return partsB[2] - partsA[2]; // Descending by week
    });
    
    // Return the sorted records
    return NextResponse.json({ 
      success: true,
      records: sortedRecords
    });
  } catch (error) {
    console.error('Error fetching FVR Leadgen data:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch FVR Leadgen data'
      },
      { status: 500 }
    );
  }
} 