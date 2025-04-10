import Chargebee from 'chargebee';

// Initialize Chargebee client
const chargebee = new Chargebee({
  site: process.env.CHARGEBEE_SITE_NAME || '',
  apiKey: process.env.CHARGEBEE_API_KEY || '',
});

/**
 * Create a new subscription
 */
export async function createSubscription(
  customerId: string, 
  planId: string,
  additionalData?: any
) {
  try {
    const response = await chargebee.subscription.create({
      plan_id: planId,
      customer_id: customerId,
      ...additionalData
    });
    return response.subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

/**
 * Get customer information
 */
export async function getCustomer(customerId: string) {
  try {
    const response = await chargebee.customer.retrieve(customerId);
    return response.customer;
  } catch (error) {
    console.error("Error retrieving customer:", error);
    throw error;
  }
}

/**
 * List all subscriptions for a customer
 */
export async function listCustomerSubscriptions(customerId: string) {
  try {
    // Passing filter parameter according to Chargebee API format
    const listParams: any = {
      limit: 100
    };
    listParams["customer_id[is]"] = customerId;
    
    const response = await chargebee.subscription.list(listParams);
    
    return response.list.map(item => item.subscription);
  } catch (error) {
    console.error("Error listing subscriptions:", error);
    throw error;
  }
}

/**
 * Process Chargebee webhooks
 */
export async function processWebhook(payload: any) {
  try {
    // Verify webhook signature if needed
    
    const { event_type, content } = payload;
    
    switch (event_type) {
      case 'subscription_created':
        // Handle subscription creation
        break;
      case 'subscription_cancelled':
        // Handle subscription cancellation
        break;
      // Handle other event types
      default:
        console.log(`Unhandled event type: ${event_type}`);
    }
    
    return { processed: true };
  } catch (error) {
    console.error("Error processing webhook:", error);
    throw error;
  }
}

/**
 * Get all subscriptions using pagination
 */
export async function getAllSubscriptions() {
  const allSubscriptions = [];
  let offset: string | undefined = undefined;

  do {
    const response = await chargebee.subscription.list({
      limit: 100,
      offset
    });
    
    const subscriptions = response.list.map(item => item.subscription);
    allSubscriptions.push(...subscriptions);
    
    offset = response.next_offset;
  } while (offset);

  return allSubscriptions;
}

// For testing purposes
export const chargebeeTest = process.env.NODE_ENV === 'development' ? 
  new Chargebee({
    site: process.env.CHARGEBEE_TEST_SITE_NAME || '',
    apiKey: process.env.CHARGEBEE_TEST_API_KEY || '',
  }) : null;

export default chargebee; 