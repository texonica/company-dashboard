import { parse as csvParse } from 'csv-parse/sync';
import { AITABLE_CONFIG, createRecord, fetchTableRecords } from '../api/aitable';
import { 
  PaymentDirection, 
  PaymentSource, 
  ProcessedPayment, 
  CSVRow,
  ImportResult,
  PaymentSchema 
} from '../types/payments';
import { 
  detectPaymentSource,
  extractTransactionId,
  generateSenderId
} from '../utils/payment-utils';
import { findClientMatch } from '../mappers/client-mapper';

/**
 * Parse CSV data and convert to structured format with enhanced processing
 */
export function parseCSVData(csvData: string): ProcessedPayment[] {
  // Parse CSV
  const records = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CSVRow[];

  return records.map(record => {
    // Extract Chargebee ID and email from description if available
    let chargebeeId: string | undefined;
    let customerEmail: string | undefined;
    
    // Pattern: ChargeBee customer: 16BVE6UKwHTz611VG (miriam@maralytics.com)
    const chargebeeRegex = /ChargeBee customer: ([A-Za-z0-9]+) \(([^)]+)\)/;
    const match = record.Description.match(chargebeeRegex);
    
    if (match) {
      chargebeeId = match[1];
      customerEmail = match[2];
    }
    
    // Detect payment source
    const paymentSource = detectPaymentSource(record.Description, record['Bank account']);
    
    const processedPayment: ProcessedPayment = {
      transactionType: record[''] as PaymentDirection,
      sender: record['Sender/receiver'],
      rawSender: record['Sender/receiver'], // Preserve original
      description: record.Description,
      bankAccount: record['Bank account'],
      date: record.Date,
      amount: parseFloat(record.Amount),
      currency: record.Currency,
      chargebeeId,
      customerEmail,
      paymentSource
    };
    
    // Extract transaction ID based on payment source
    processedPayment.transactionId = extractTransactionId(processedPayment);
    
    return processedPayment;
  });
}

/**
 * Import CSV data to AITable with enhanced client matching
 */
export async function importCSVToAITable(csvData: string): Promise<ImportResult> {
  if (!AITABLE_CONFIG.PAYMENTS_TABLE_ID) {
    throw new Error('AITABLE_PAYMENTS_TABLE_ID is not configured');
  }

  const processed = parseCSVData(csvData);
  
  const result: ImportResult = {
    total: processed.length,
    imported: 0,
    failed: 0,
    matched: 0,
    unmatched: 0,
    errors: []
  };
  
  for (const payment of processed) {
    try {
      // Try to find client match
      const clientId = await findClientMatch(payment);
      
      // Create payment record data
      const paymentData: { fields: PaymentSchema } = {
        fields: {
          Name: `${payment.transactionType}-${payment.date}-${Math.abs(payment.amount)}${payment.currency}`,
          Date: payment.date,
          Amount: Math.abs(payment.amount), // Store positive value
          PaymentDirection: payment.transactionType,
          PaymentMethod: payment.bankAccount,
          Currency: payment.currency,
          Description: payment.description,
          Sender: payment.sender,
          RawSender: payment.rawSender,
          ChargebeeId: payment.chargebeeId || '',
          CustomerEmail: payment.customerEmail || '',
          PaymentSource: payment.paymentSource,
          BankAccount: payment.bankAccount,
          TransactionId: payment.transactionId || ''
        }
      };
      
      // Add client if matched
      if (clientId) {
        paymentData.fields.Client = clientId;
        result.matched++;
      } else {
        result.unmatched++;
      }
      
      // Try to find subscription if Chargebee ID exists
      if (payment.chargebeeId && AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID) {
        const filter = `ChargebeeId="${payment.chargebeeId}"`;
        const subscriptions = await fetchTableRecords(AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID, filter);
        
        if (subscriptions && subscriptions.length > 0) {
          paymentData.fields.Subscription = subscriptions[0].recordId;
        }
      }
      
      // Create record in AITable
      await createRecord(AITABLE_CONFIG.PAYMENTS_TABLE_ID, paymentData);
      result.imported++;
    } catch (error: any) {
      console.error(`Error importing payment:`, error, payment);
      result.failed++;
      result.errors.push(`Failed to import payment (${payment.date}, ${payment.amount}${payment.currency}): ${error.message}`);
    }
  }
  
  return result;
} 