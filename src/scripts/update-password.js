/**
 * Utility script to generate a password hash and update credentials
 * 
 * Run with: node src/scripts/update-password.js
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config();

async function generatePasswordHash() {
  // Generate hash for admin password
  const password = 'admin';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Generated hash for password "admin":');
  console.log(hash);
  
  console.log('\nTo update your system with this password:');
  console.log('1. Add or modify your .env.local file with:');
  console.log(`USER_CREDENTIALS=admin:${hash},CEO`);
  
  console.log('\n2. Or update the auth.ts file directly if it uses a hardcoded value:');
  console.log(`const USER_CREDENTIALS = process.env.USER_CREDENTIALS || 'admin:${hash},CEO';`);
  
  // Optional: try to update the .env.local file directly
  try {
    if (fs.existsSync('.env.local')) {
      let envContent = fs.readFileSync('.env.local', 'utf8');
      
      // Check if USER_CREDENTIALS already exists
      if (envContent.includes('USER_CREDENTIALS=')) {
        // Replace existing credential
        envContent = envContent.replace(
          /USER_CREDENTIALS=.*/,
          `USER_CREDENTIALS=admin:${hash},CEO`
        );
      } else {
        // Add new credential
        envContent += `\nUSER_CREDENTIALS=admin:${hash},CEO`;
      }
      
      fs.writeFileSync('.env.local', envContent);
      console.log('\nSuccessfully updated .env.local file with new credentials!');
    } else {
      // Create new .env.local file
      fs.writeFileSync('.env.local', `USER_CREDENTIALS=admin:${hash},CEO\n`);
      console.log('\nCreated new .env.local file with credentials!');
    }
  } catch (error) {
    console.error('Error updating .env.local file:', error.message);
    console.log('Please update the credentials manually as shown above.');
  }
}

generatePasswordHash(); 