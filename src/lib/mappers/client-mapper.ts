import { ClientMapping, PaymentSource, ProcessedPayment } from '../types/payments';
import { generateSenderId, normalizeClientName, calculateMatchConfidence } from '../utils/payment-utils';
import { AITABLE_CONFIG, fetchTableRecords, createRecord, AITableClient } from '../api/aitable';

// In-memory cache for client mapping data
let clientMappingsCache: Record<string, ClientMapping> = {};
let clientsCache: Record<string, AITableClient> = {};
let cacheInitialized = false;

/**
 * Initialize the mapping system and load existing mappings
 */
export async function initClientMappingSystem(): Promise<void> {
  if (cacheInitialized) return;
  
  try {
    if (!AITABLE_CONFIG.CLIENT_MAPPINGS_TABLE_ID) {
      console.error('Missing CLIENT_MAPPINGS_TABLE_ID configuration');
      return;
    }
    
    // Load existing mappings from AITable
    const mappings = await fetchTableRecords(AITABLE_CONFIG.CLIENT_MAPPINGS_TABLE_ID);
    
    // Reset cache
    clientMappingsCache = {};
    
    // Process mappings into cache
    mappings.forEach(mapping => {
      const senderId = mapping.fields.SenderId as string;
      
      if (senderId) {
        clientMappingsCache[senderId] = {
          senderId: senderId,
          rawSender: mapping.fields.RawSender as string,
          clientId: mapping.fields.ClientId as string,
          confidence: mapping.fields.Confidence as number ?? 0,
          lastUsed: mapping.fields.LastUsed as string ?? new Date().toISOString(),
          paymentSource: mapping.fields.PaymentSource as PaymentSource ?? PaymentSource.UNKNOWN,
          usageCount: mapping.fields.UsageCount as number ?? 1
        };
      }
    });
    
    // Load clients for matching
    await loadClients();
    
    cacheInitialized = true;
    console.log(`Initialized client mapping system with ${Object.keys(clientMappingsCache).length} mappings`);
  } catch (error) {
    console.error('Failed to initialize client mapping system:', error);
    cacheInitialized = false;
  }
}

/**
 * Load clients for matching
 */
async function loadClients(): Promise<void> {
  if (!AITABLE_CONFIG.CLIENTS_TABLE_ID) {
    console.error('Missing CLIENTS_TABLE_ID configuration');
    return;
  }
  
  try {
    const clients = await fetchTableRecords(AITABLE_CONFIG.CLIENTS_TABLE_ID);
    
    // Reset cache
    clientsCache = {};
    
    // Process clients into cache
    clients.forEach(client => {
      clientsCache[client.recordId] = client;
    });
    
    console.log(`Loaded ${Object.keys(clientsCache).length} clients for matching`);
  } catch (error) {
    console.error('Failed to load clients:', error);
  }
}

/**
 * Find best client match for a payment
 */
export async function findClientMatch(payment: ProcessedPayment): Promise<string | null> {
  if (!cacheInitialized) {
    await initClientMappingSystem();
  }
  
  const senderId = generateSenderId(payment.sender, payment.paymentSource);
  
  // Check if we have an exact mapping already
  if (clientMappingsCache[senderId]) {
    const mapping = clientMappingsCache[senderId];
    
    // Update usage stats in memory (will be persisted later)
    mapping.lastUsed = new Date().toISOString();
    mapping.usageCount += 1;
    
    return mapping.clientId;
  }
  
  // Try to find a matching client
  const normalizedSender = normalizeClientName(payment.sender);
  let bestMatch: { clientId: string, confidence: number } | null = null;
  
  // Look through clients for potential matches
  for (const clientId in clientsCache) {
    const client = clientsCache[clientId];
    const clientName = client.fields.Name as string;
    
    if (clientName) {
      const normalizedClientName = normalizeClientName(clientName);
      const confidence = calculateMatchConfidence(normalizedSender, normalizedClientName);
      
      // Update best match if this one is better
      if (confidence > 0 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { clientId, confidence };
      }
    }
  }
  
  // If we found a match with confidence over threshold, create a mapping
  if (bestMatch && bestMatch.confidence >= 70) {
    await saveClientMapping({
      senderId,
      rawSender: payment.rawSender,
      clientId: bestMatch.clientId,
      confidence: bestMatch.confidence,
      lastUsed: new Date().toISOString(),
      paymentSource: payment.paymentSource,
      usageCount: 1
    });
    
    return bestMatch.clientId;
  }
  
  return null;
}

/**
 * Save a client mapping to AITable
 */
export async function saveClientMapping(mapping: ClientMapping): Promise<void> {
  if (!AITABLE_CONFIG.CLIENT_MAPPINGS_TABLE_ID) {
    console.error('Missing CLIENT_MAPPINGS_TABLE_ID configuration');
    return;
  }
  
  try {
    // Save to AITable
    await createRecord(AITABLE_CONFIG.CLIENT_MAPPINGS_TABLE_ID, {
      fields: {
        SenderId: mapping.senderId,
        RawSender: mapping.rawSender,
        ClientId: mapping.clientId,
        Confidence: mapping.confidence,
        LastUsed: mapping.lastUsed,
        PaymentSource: mapping.paymentSource,
        UsageCount: mapping.usageCount
      }
    });
    
    // Update cache
    clientMappingsCache[mapping.senderId] = mapping;
    
    console.log(`Saved client mapping: ${mapping.rawSender} -> ${mapping.clientId} (${mapping.confidence}%)`);
  } catch (error) {
    console.error('Failed to save client mapping:', error);
  }
}

/**
 * Create a manual client mapping
 */
export async function createManualClientMapping(
  rawSender: string, 
  clientId: string, 
  paymentSource: PaymentSource
): Promise<void> {
  const senderId = generateSenderId(rawSender, paymentSource);
  
  await saveClientMapping({
    senderId,
    rawSender,
    clientId,
    confidence: 100, // Manual mappings are 100% confidence
    lastUsed: new Date().toISOString(),
    paymentSource,
    usageCount: 1
  });
} 