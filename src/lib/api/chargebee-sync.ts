import { AITABLE_CONFIG, updateRecord, createRecord, fetchTableRecords } from './aitable';
import { getAllSubscriptions, getCustomer } from './chargebee';

interface SyncResult {
  added: number;
  updated: number;
  failed: number;
  errors: string[];
}

/**
 * Maps Chargebee subscription data to AITable fields
 */
function mapSubscriptionToAITable(subscription: any, customer: any) {
  return {
    fields: {
      Name: `Subscription-${subscription.id}`,
      Client: customer?.company || customer?.first_name + ' ' + customer?.last_name,
      StartDate: subscription.created_at ? new Date(subscription.created_at * 1000).toISOString().split('T')[0] : '',
      EndDate: subscription.cancelled_at ? new Date(subscription.cancelled_at * 1000).toISOString().split('T')[0] : '',
      Status: subscription.status,
      Amount: subscription.plan_amount / 100, // Convert from cents
      Currency: subscription.currency_code,
      BillingCycle: subscription.billing_period,
      ChargebeeId: subscription.id,
      CustomerEmail: customer?.email,
      NextBillingDate: subscription.next_billing_at ? new Date(subscription.next_billing_at * 1000).toISOString().split('T')[0] : '',
      PlanName: subscription.plan_id
    }
  };
}

/**
 * Sync all Chargebee subscriptions to AITable
 */
export async function syncSubscriptionsToAITable(): Promise<SyncResult> {
  if (!AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID) {
    throw new Error('AITABLE_SUBSCRIPTIONS_TABLE_ID is not configured');
  }

  const result: SyncResult = {
    added: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  try {
    // Fetch all subscriptions from Chargebee
    const subscriptions = await getAllSubscriptions();
    console.log(`Fetched ${subscriptions.length} subscriptions from Chargebee`);

    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        // Fetch customer data for this subscription
        const customer = await getCustomer(subscription.customer_id);
        
        // Create or update AITable record
        // First check if we already have this subscription by using a filter
        const filter = `ChargebeeId="${subscription.id}"`;
        const records = await fetchTableRecords(AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID, filter);
        
        const aiTableData = mapSubscriptionToAITable(subscription, customer);
        
        if (records && records.length > 0) {
          // Update existing record
          await updateRecord(
            AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID,
            records[0].recordId,
            aiTableData
          );
          result.updated++;
        } else {
          // Create new record
          await createRecord(
            AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID,
            aiTableData
          );
          result.added++;
        }
      } catch (error: any) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        result.failed++;
        result.errors.push(`Failed to process subscription ${subscription.id}: ${error.message}`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error syncing subscriptions to AITable:', error);
    throw error;
  }
} 