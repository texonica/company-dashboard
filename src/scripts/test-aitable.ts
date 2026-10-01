/**
 * Test script for AITable API integration
 * 
 * This script tests the AITable API client with the constants we've defined.
 * Run with: npx ts-node src/scripts/test-aitable.ts
 */

import { aitable } from '../lib/api/aitable';
import { AITABLE_DATASHEETS } from '../lib/constants';
import { Project, Client, Payment, Subscription } from '../types/aitable';

async function testAITableAPI() {
  console.log('Testing AITable API integration...');
  
  try {
    // Test fetching projects
    console.log(`\nFetching projects from datasheet ID: ${AITABLE_DATASHEETS.PROJECTS}`);
    const projectsData = await aitable.getRecords<Project>(AITABLE_DATASHEETS.PROJECTS, { pageSize: 5 });
    console.log(`Successfully fetched ${projectsData.records.length} projects out of ${projectsData.total}`);
    console.log('Sample project:', JSON.stringify(projectsData.records[0], null, 2));
    
    // Test fetching clients
    console.log(`\nFetching clients from datasheet ID: ${AITABLE_DATASHEETS.CLIENTS}`);
    const clientsData = await aitable.getRecords<Client>(AITABLE_DATASHEETS.CLIENTS, { pageSize: 5 });
    console.log(`Successfully fetched ${clientsData.records.length} clients out of ${clientsData.total}`);
    console.log('Sample client:', JSON.stringify(clientsData.records[0], null, 2));
    
    // Test fetching payments
    console.log(`\nFetching payments from datasheet ID: ${AITABLE_DATASHEETS.PAYMENTS}`);
    const paymentsData = await aitable.getRecords<Payment>(AITABLE_DATASHEETS.PAYMENTS, { pageSize: 5 });
    console.log(`Successfully fetched ${paymentsData.records.length} payments out of ${paymentsData.total}`);
    console.log('Sample payment:', JSON.stringify(paymentsData.records[0], null, 2));
    
    // Test fetching subscriptions
    console.log(`\nFetching subscriptions from datasheet ID: ${AITABLE_DATASHEETS.SUBSCRIPTIONS}`);
    const subscriptionsData = await aitable.getRecords<Subscription>(AITABLE_DATASHEETS.SUBSCRIPTIONS, { pageSize: 5 });
    console.log(`Successfully fetched ${subscriptionsData.records.length} subscriptions out of ${subscriptionsData.total}`);
    console.log('Sample subscription:', JSON.stringify(subscriptionsData.records[0], null, 2));
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing AITable API:', error);
  }
}

// Run the test
testAITableAPI(); 