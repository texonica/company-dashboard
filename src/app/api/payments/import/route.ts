import { NextResponse } from 'next/server';
import { importCSVToAITable } from '@/lib/importers/csv-importer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const csvFile = formData.get('file') as File;
    
    if (!csvFile) {
      return NextResponse.json(
        { error: 'No CSV file provided' },
        { status: 400 }
      );
    }
    
    const csvData = await csvFile.text();
    const result = await importCSVToAITable(csvData);
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Error importing CSV data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 