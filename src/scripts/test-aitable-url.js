/**
 * Test script to verify the AITable API URL
 * 
 * This script directly tests various AITable API endpoints to find the correct one.
 * Run with: node src/scripts/test-aitable-url.js
 */

const axios = require('axios');
require('dotenv').config();

// AITable API token from environment variables
const API_TOKEN = process.env.AITABLE_API_TOKEN;
const SPACE_ID = 'spc12q5HY4ay5'; // Texonica space ID
const DATASHEET_ID = 'dstq4onAEtjMleaeCm'; // Projects datasheet ID

// Print masked token for debugging
const maskedToken = API_TOKEN ? `${API_TOKEN.substring(0, 4)}...${API_TOKEN.substring(API_TOKEN.length - 4)}` : 'Not found';
console.log('Using API Token:', maskedToken);

// Possible base URLs to try
const baseUrls = [
  'https://api.aitable.ai/fusion/v1',
  'https://aitable.ai/fusion/v1', 
  'https://fusion.aitable.ai/v1',
  'https://api.aitable.ai/api/v1',
  'https://aitable.com/fusion/v1'
];

async function testEndpoint(baseUrl, endpoint) {
  try {
    console.log(`Testing: ${baseUrl}${endpoint}`);
    
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // Don't throw on any status code
    });
    
    console.log(`  Status: ${response.status}`);
    console.log(`  Response: ${JSON.stringify(response.data).substring(0, 150)}...`);
    return true;
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return false;
  }
}

async function testAllEndpoints() {
  console.log('Testing AITable API endpoints...\n');
  
  for (const baseUrl of baseUrls) {
    console.log(`\nTesting base URL: ${baseUrl}`);
    
    // Test spaces endpoint
    await testEndpoint(baseUrl, '/spaces');
    
    // Test space datasheets endpoint
    await testEndpoint(baseUrl, `/spaces/${SPACE_ID}/datasheets`);
    
    // Test datasheet records endpoint (the one failing in our app)
    await testEndpoint(baseUrl, `/spaces/${SPACE_ID}/nodes/${DATASHEET_ID}/records`);
    
    console.log('-'.repeat(80));
  }
}

// Run the test
testAllEndpoints(); 