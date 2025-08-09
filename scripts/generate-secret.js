#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure random string for NEXTAUTH_SECRET
const secret = crypto.randomBytes(32).toString('hex');

console.log('🔐 Generated secure NEXTAUTH_SECRET for production:');
console.log('');
console.log(secret);
console.log('');
console.log('📋 Copy this value to your Render environment variables as NEXTAUTH_SECRET');
console.log('');
console.log('⚠️  Keep this secret secure and never commit it to version control!');
