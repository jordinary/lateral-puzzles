#!/usr/bin/env node

/**
 * Script to clear broken image references from levels
 * This will help fix the "Image could not be loaded" error
 */

const https = require('https');

// Configuration
const RENDER_API_KEY = 'rnd_d43Lz1rGHFUdIQADibYOFbxRV3d2';
const SERVICE_ID = 'srv-d2bomkruibrs73fqpqv0';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function clearBrokenImages() {
  try {
    console.log('🔧 Clearing broken image references...\n');

    // First, let\'s check what levels exist
    console.log('📊 Checking current levels...');
    const levelsResponse = await makeRequest('https://lateral-puzzles.onrender.com/api/levels');
    
    if (levelsResponse.status !== 200) {
      console.log('❌ Cannot access levels API. You may need to:');
      console.log('1. Go to the admin dashboard');
      console.log('2. Manually edit Level 1');
      console.log('3. Remove the current image');
      console.log('4. Save the level');
      return;
    }

    console.log('✅ Levels API accessible');
    console.log('Found levels:', levelsResponse.data.length || 'Unknown');

    // Check if we can access admin levels
    console.log('\n🔐 Checking admin access...');
    try {
      const adminResponse = await makeRequest('https://lateral-puzzles.onrender.com/api/admin/levels');
      if (adminResponse.status === 200) {
        console.log('✅ Admin API accessible');
        console.log('Admin levels found:', adminResponse.data.length || 'Unknown');
        
        // Show current image configurations
        console.log('\n📸 Current image configurations:');
        adminResponse.data.forEach((level, index) => {
          const hasImage = level.assetUrl || level.content;
          console.log(`Level ${level.number}: ${hasImage ? 'Has image' : 'No image'} (${level.assetUrl || 'None'})`);
        });
        
      } else if (adminResponse.status === 401) {
        console.log('ℹ️ Admin API requires authentication');
      } else {
        console.log('❌ Admin API error:', adminResponse.status);
      }
    } catch (error) {
      console.log('ℹ️ Admin API check failed (expected if not logged in)');
    }

    console.log('\n🛠️ MANUAL FIX REQUIRED:');
    console.log('Since the API requires authentication, you need to fix this manually:');
    console.log('');
    console.log('1. Go to: https://lateral-puzzles.onrender.com/admin');
    console.log('2. Log in with your admin credentials');
    console.log('3. Find Level 1 in the levels list');
    console.log('4. Click "Edit" on Level 1');
    console.log('5. Remove the current broken image');
    console.log('6. Save the level');
    console.log('');
    console.log('ALTERNATIVELY, if you want to keep an image:');
    console.log('1. Edit Level 1');
    console.log('2. Upload a new image (it will use ImageKit automatically)');
    console.log('3. Save the level');
    console.log('');
    console.log('✅ After this fix:');
    console.log('• Level 1 will work without the broken image');
    console.log('• New image uploads will use ImageKit');
    console.log('• No more "Image could not be loaded" errors');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

console.log('🔧 Broken Image Fix Tool');
console.log('========================\n');

clearBrokenImages();
