/**
 * Script to generate mock data for testing
 * 
 * This script creates a mock data file that can be used when the AITable API
 * is not accessible or when testing without a valid token.
 * Run with: node src/scripts/mock-data.js
 */

const fs = require('fs');
const path = require('path');

// Create mock data
const mockData = {
  projects: [
    {
      recordId: 'rec01',
      name: 'Website Redesign',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      client: 'Acme Corp',
      progress: 60,
      createdAt: '2024-12-20T10:00:00Z',
      updatedAt: '2025-02-15T14:30:00Z'
    },
    {
      recordId: 'rec02',
      name: 'Mobile App Development',
      status: 'on-hold',
      startDate: '2025-02-01',
      endDate: '2025-06-30',
      client: 'TechStart Inc',
      progress: 25,
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-02-10T11:20:00Z'
    },
    {
      recordId: 'rec03',
      name: 'SEO Optimization',
      status: 'completed',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      client: 'Digital Solutions',
      progress: 100,
      createdAt: '2025-01-10T08:30:00Z',
      updatedAt: '2025-02-15T16:45:00Z'
    }
  ],
  clients: [
    {
      recordId: 'cli01',
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      phone: '+1234567890',
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2025-01-15T14:30:00Z'
    },
    {
      recordId: 'cli02',
      name: 'TechStart Inc',
      email: 'info@techstart.com',
      phone: '+0987654321',
      createdAt: '2024-12-05T09:00:00Z',
      updatedAt: '2025-01-20T11:20:00Z'
    },
    {
      recordId: 'cli03',
      name: 'Digital Solutions',
      email: 'hello@digitalsolutions.com',
      phone: '+1122334455',
      createdAt: '2025-01-10T08:30:00Z',
      updatedAt: '2025-02-01T16:45:00Z'
    }
  ],
  payments: [
    {
      recordId: 'pay01',
      amount: 5000,
      currency: 'USD',
      status: 'paid',
      client: 'cli01',
      project: 'rec01',
      date: '2025-01-15',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    },
    {
      recordId: 'pay02',
      amount: 2500,
      currency: 'USD',
      status: 'pending',
      client: 'cli02',
      project: 'rec02',
      date: '2025-02-01',
      createdAt: '2025-02-01T09:00:00Z',
      updatedAt: '2025-02-01T09:00:00Z'
    },
    {
      recordId: 'pay03',
      amount: 1800,
      currency: 'USD',
      status: 'paid',
      client: 'cli03',
      project: 'rec03',
      date: '2025-02-15',
      createdAt: '2025-02-15T08:30:00Z',
      updatedAt: '2025-02-15T15:45:00Z'
    }
  ],
  subscriptions: [
    {
      recordId: 'sub01',
      name: 'Website Maintenance',
      client: 'cli01',
      project: 'rec01',
      amount: 500,
      currency: 'USD',
      frequency: 'monthly',
      status: 'active',
      startDate: '2025-01-01',
      createdAt: '2024-12-20T10:00:00Z',
      updatedAt: '2025-01-01T14:30:00Z'
    },
    {
      recordId: 'sub02',
      name: 'App Hosting',
      client: 'cli02',
      project: 'rec02',
      amount: 300,
      currency: 'USD',
      frequency: 'monthly',
      status: 'active',
      startDate: '2025-02-01',
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-02-01T11:20:00Z'
    }
  ]
};

// Wrap data in appropriate format for AITable API response
const formatAITableResponse = (records, type) => {
  return {
    success: true,
    code: 200,
    message: 'success',
    data: {
      records: records.map(record => ({
        recordId: record.recordId,
        fields: { ...record },
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      })),
      total: records.length,
      pageNum: 1,
      pageSize: 100
    }
  };
};

// Create mock response files
const mockDir = path.join(__dirname, '..', '..', 'mock-data');

// Create directory if it doesn't exist
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

// Write mock response files
Object.entries(mockData).forEach(([key, data]) => {
  const formattedData = formatAITableResponse(data, key);
  fs.writeFileSync(
    path.join(mockDir, `${key}.json`),
    JSON.stringify(formattedData, null, 2)
  );
});

// Create index file with instructions
const readmeContent = `# Mock AITable API Data

This directory contains mock data for testing the application when the AITable API
is not accessible or when testing without a valid token.

## How to Use

1. In your \`.env.local\` file, add the following:

\`\`\`
USE_MOCK_DATA=true
\`\`\`

2. Update your AITable API client to use this mock data when the environment variable is set.
`;

fs.writeFileSync(path.join(mockDir, 'README.md'), readmeContent);

console.log('Mock data has been generated in the mock-data directory.');
console.log('Files created:');
Object.keys(mockData).forEach(key => {
  console.log(`- ${key}.json`);
});
console.log('- README.md');

console.log('\nTo use this mock data, add USE_MOCK_DATA=true to your .env.local file');
console.log('Then update your AITable API client to use this data when the flag is set.'); 