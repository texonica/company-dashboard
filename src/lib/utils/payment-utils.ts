import { PaymentDirection, PaymentSource, ProcessedPayment } from '../types/payments';

/**
 * Detects the payment source based on description and bank account
 */
export function detectPaymentSource(description: string, bankAccount: string): PaymentSource {
  // Normalize inputs for case-insensitive matching
  const desc = description.toLowerCase();
  const account = bankAccount.toLowerCase();
  
  // Check for Stripe/Chargebee
  if (desc.includes('chargebee') || desc.includes('stripe')) {
    return desc.includes('chargebee') ? PaymentSource.CHARGEBEE : PaymentSource.STRIPE;
  }
  
  // Check for PayPal
  if (desc.includes('paypal') || account.includes('paypal')) {
    return PaymentSource.PAYPAL;
  }
  
  // Check bank accounts for wire transfers (simplified - expand with your specific accounts)
  const wireAccountPatterns = ['bank transfer', 'wire', 'iban', 'swift'];
  if (wireAccountPatterns.some(pattern => account.includes(pattern))) {
    return PaymentSource.WIRE;
  }
  
  // Default to unknown
  return PaymentSource.UNKNOWN;
}

/**
 * Extract transaction ID from payment description based on source
 */
export function extractTransactionId(payment: ProcessedPayment): string | undefined {
  const desc = payment.description.toLowerCase();
  
  switch (payment.paymentSource) {
    case PaymentSource.STRIPE:
      // Stripe uses format like: "Stripe reference: ch_1NxyzABC123DEF"
      const stripeMatch = payment.description.match(/(?:stripe\s+reference:|ch_)\s*([a-zA-Z0-9_]+)/i);
      return stripeMatch ? stripeMatch[1] : undefined;
      
    case PaymentSource.CHARGEBEE:
      // Chargebee customer ID format
      const chargebeeMatch = payment.description.match(/ChargeBee customer: ([A-Za-z0-9]+)/i);
      return chargebeeMatch ? chargebeeMatch[1] : undefined;
      
    case PaymentSource.PAYPAL:
      // PayPal transaction ID format 
      const paypalMatch = payment.description.match(/(?:paypal|transaction id:)\s*([A-Z0-9]+)/i);
      return paypalMatch ? paypalMatch[1] : undefined;
      
    default:
      return undefined;
  }
}

/**
 * Normalize client name for better matching
 */
export function normalizeClientName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric
    .trim();
}

/**
 * Generate a sender ID for mapping purposes 
 */
export function generateSenderId(sender: string, source: PaymentSource): string {
  return `${normalizeClientName(sender)}_${source}`;
}

/**
 * Calculate confidence score for a sender-client match
 */
export function calculateMatchConfidence(normalizedSender: string, normalizedClientName: string): number {
  // Simple implementation - can be expanded with more sophisticated algorithms
  if (normalizedSender === normalizedClientName) {
    return 100; // Exact match
  }
  
  if (normalizedClientName.includes(normalizedSender) || normalizedSender.includes(normalizedClientName)) {
    const longer = Math.max(normalizedSender.length, normalizedClientName.length);
    const shorter = Math.min(normalizedSender.length, normalizedClientName.length);
    return Math.round((shorter / longer) * 100);
  }
  
  return 0; // No match
} 