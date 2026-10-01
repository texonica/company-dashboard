/**
 * Utility script to check password hash
 */

const bcrypt = require('bcryptjs');

// The hash from the auth.ts file
const passwordHash = '$2a$10$IG5Gu2mLXKALtB9lCJLdUORgZu5p.0u1v3u4U8.KvWLhXREvc1jEu';

async function checkPassword() {
  // Test password123
  console.log('Checking password123...');
  const match1 = await bcrypt.compare('password123', passwordHash);
  console.log('Match:', match1);

  // Test another common format
  console.log('\nChecking admin123...');
  const match2 = await bcrypt.compare('admin123', passwordHash);
  console.log('Match:', match2);

  // Generate a hash for a known password to use
  console.log('\nGenerating hash for testing123:');
  const hash = await bcrypt.hash('testing123', 10);
  console.log('Hash:', hash);
}

checkPassword(); 