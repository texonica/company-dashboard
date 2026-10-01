/**
 * Test script for Next.js API routes
 * 
 * This script tests the Next.js API routes that use the AITable API.
 * Run with: node src/scripts/test-api.js
 */

const axios = require('axios');

async function loginAndGetToken() {
  try {
    console.log('Logging in to get auth token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin'
    });
    
    console.log('Login successful!');
    return loginResponse.data.token;
  } catch (error) {
    console.error('Login failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error('Failed to obtain auth token');
  }
}

async function testAPIRoutes() {
  console.log('Testing Next.js API routes...');
  
  try {
    // Try both authentication methods
    let authenticatedAxios;
    
    try {
      // First try to login and get a token
      const token = await loginAndGetToken();
      authenticatedAxios = axios.create({
        headers: {
          'Cookie': `auth_token=${token}`,
          'x-user-role': 'CEO'
        }
      });
    } catch (error) {
      console.log('Falling back to bypass authentication mode...');
      // Fall back to bypass auth if login fails
      authenticatedAxios = axios.create({
        headers: {
          'x-user-role': 'CEO',
          'x-bypass-auth': 'true'
        }
      });
    }
    
    // Test the dashboard summary API route
    console.log('\nFetching dashboard summary data...');
    const summaryResponse = await authenticatedAxios.get('http://localhost:3000/api/dashboard/summary');
    console.log('Dashboard summary data:', JSON.stringify(summaryResponse.data, null, 2));
    
    // Test the dashboard projects API route
    console.log('\nFetching dashboard projects data...');
    const projectsResponse = await authenticatedAxios.get('http://localhost:3000/api/dashboard/projects');
    
    if (projectsResponse.data.projects && projectsResponse.data.projects.length > 0) {
      console.log(`Successfully fetched ${projectsResponse.data.projects.length} projects`);
      console.log('Sample project:', JSON.stringify(projectsResponse.data.projects[0], null, 2));
    } else {
      console.log('Projects data returned, but no projects found:', JSON.stringify(projectsResponse.data, null, 2));
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing API routes:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testAPIRoutes();