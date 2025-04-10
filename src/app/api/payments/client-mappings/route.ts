import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords } from '@/lib/api/aitable';
import { PaymentSource } from '@/lib/types/payments';

export async function GET(request: Request) {
  try {
    if (!AITABLE_CONFIG.CLIENT_MAPPINGS_TABLE_ID) {
      return NextResponse.json(
        { error: 'Missing CLIENT_MAPPINGS_TABLE_ID configuration' },
        { status: 500 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const paymentSource = searchParams.get('paymentSource');
    const clientId = searchParams.get('clientId');
    const minConfidence = searchParams.get('minConfidence');
    
    // Build filter
    let filter = '';
    const filters = [];
    
    if (paymentSource) {
      filters.push(`{PaymentSource}="${paymentSource}"`);
    }
    
    if (clientId) {
      filters.push(`{ClientId}="${clientId}"`);
    }
    
    if (minConfidence) {
      const confidenceValue = parseInt(minConfidence, 10);
      if (!isNaN(confidenceValue)) {
        filters.push(`{Confidence}>=${confidenceValue}`);
      }
    }
    
    if (filters.length > 0) {
      filter = filters.join(' AND ');
    }
    
    // Fetch mappings
    const mappings = await fetchTableRecords(AITABLE_CONFIG.CLIENT_MAPPINGS_TABLE_ID, filter);
    
    // Transform data for response
    const formattedMappings = mappings.map(mapping => ({
      id: mapping.recordId,
      senderId: mapping.fields.SenderId,
      rawSender: mapping.fields.RawSender,
      clientId: mapping.fields.ClientId,
      confidence: mapping.fields.Confidence,
      lastUsed: mapping.fields.LastUsed,
      paymentSource: mapping.fields.PaymentSource,
      usageCount: mapping.fields.UsageCount || 1
    }));
    
    // Get statistics
    const stats = {
      total: formattedMappings.length,
      bySource: {} as Record<string, number>,
      byConfidence: {
        high: 0, // 90-100
        medium: 0, // 70-89
        low: 0 // <70
      }
    };
    
    // Calculate statistics
    formattedMappings.forEach(mapping => {
      // Count by source
      const source = mapping.paymentSource as string || PaymentSource.UNKNOWN;
      if (!stats.bySource[source]) {
        stats.bySource[source] = 0;
      }
      stats.bySource[source]++;
      
      // Count by confidence
      const confidence = mapping.confidence as number || 0;
      if (confidence >= 90) {
        stats.byConfidence.high++;
      } else if (confidence >= 70) {
        stats.byConfidence.medium++;
      } else {
        stats.byConfidence.low++;
      }
    });
    
    return NextResponse.json({
      mappings: formattedMappings,
      stats
    });
  } catch (error: any) {
    console.error('Error fetching client mappings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 