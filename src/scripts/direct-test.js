/**
 * Direct test script for AITable API
 * 
 * This script directly tests the AITable API without using the constants.
 * Run with: node src/scripts/direct-test.js
 */

// Import axios for direct API calls
const axios = require('axios');
require('dotenv').config();

// AITable API token from environment variables
const API_TOKEN = process.env.AITABLE_API_TOKEN;
const SPACE_ID = 'spc12q5HY4ay5'; // Texonica space ID

// Print masked token for debugging
console.log('API Token loaded:', API_TOKEN ? `${API_TOKEN.substring(0, 4)}...${API_TOKEN.substring(API_TOKEN.length - 4)}` : 'Not found');

// Datasheet IDs
const PROJECTS_ID = 'dstq4onAEtjMleaeCm';
const CLIENTS_ID = 'dstoHuLq5fWmzRZvna';
const PAYMENTS_ID = 'dst6yHG1gcUHquvMD0';
const SUBSCRIPTIONS_ID = 'dst93iSE1ToDG39AUY';

// Create axios instance
const client = axios.create({
  baseURL: 'https://aitable.ai/fusion/v1',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

async function testAITableAPI() {
  console.log('Testing AITable API integration directly...');
  
  try {
    // Test fetching projects
    console.log(`\nFetching projects from datasheet ID: ${PROJECTS_ID}`);
    const projectsResponse = await client.get(`/spaces/${SPACE_ID}/nodes/${PROJECTS_ID}/records`, {
      params: { pageSize: 5 }
    });
    const projectsData = projectsResponse.data.data;
    console.log(`Successfully fetched ${projectsData.records.length} projects out of ${projectsData.total}`);
    console.log('Sample project:', JSON.stringify(projectsData.records[0], null, 2));
    
    // Test fetching clients
    console.log(`\nFetching clients from datasheet ID: ${CLIENTS_ID}`);
    const clientsResponse = await client.get(`/spaces/${SPACE_ID}/nodes/${CLIENTS_ID}/records`, {
      params: { pageSize: 5 }
    });
    const clientsData = clientsResponse.data.data;
    console.log(`Successfully fetched ${clientsData.records.length} clients out of ${clientsData.total}`);
    console.log('Sample client:', JSON.stringify(clientsData.records[0], null, 2));
    
    // Test fetching payments
    console.log(`\nFetching payments from datasheet ID: ${PAYMENTS_ID}`);
    const paymentsResponse = await client.get(`/spaces/${SPACE_ID}/nodes/${PAYMENTS_ID}/records`, {
      params: { pageSize: 5 }
    });
    const paymentsData = paymentsResponse.data.data;
    console.log(`Successfully fetched ${paymentsData.records.length} payments out of ${paymentsData.total}`);
    console.log('Sample payment:', JSON.stringify(paymentsData.records[0], null, 2));
    
    // Test fetching subscriptions
    console.log(`\nFetching subscriptions from datasheet ID: ${SUBSCRIPTIONS_ID}`);
    const subscriptionsResponse = await client.get(`/spaces/${SPACE_ID}/nodes/${SUBSCRIPTIONS_ID}/records`, {
      params: { pageSize: 5 }
    });
    const subscriptionsData = subscriptionsResponse.data.data;
    console.log(`Successfully fetched ${subscriptionsData.records.length} subscriptions out of ${subscriptionsData.total}`);
    console.log('Sample subscription:', JSON.stringify(subscriptionsData.records[0], null, 2));
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing AITable API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testAITableAPI(); 