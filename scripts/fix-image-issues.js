#!/usr/bin/env node

/**
 * Script to fix image issues by checking current level configurations
 * and providing options to fix them
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

async function checkLevelImages() {
  try {
    console.log('🔍 Checking level images and configurations...\n');

    // Check the test images page to see what's currently displayed
    console.log('📱 Checking current level display...');
    const testResponse = await makeRequest('https://lateral-puzzles.onrender.com/test-images');
    console.log('Test images page status:', testResponse.status);

    // Check if there are any levels with images
    console.log('\n📊 Checking levels API...');
    const levelsResponse = await makeRequest('https://lateral-puzzles.onrender.com/api/levels');
    if (levelsResponse.status === 200) {
      console.log('✅ Levels API accessible');
      console.log('Levels found:', levelsResponse.data.length || 'Unknown');
    } else {
      console.log('❌ Levels API error:', levelsResponse.status);
    }

    // Check admin levels to see what images are configured
    console.log('\n🔐 Checking admin levels (this may fail if not logged in)...');
    try {
      const adminLevelsResponse = await makeRequest('https://lateral-puzzles.onrender.com/api/admin/levels');
      if (adminLevelsResponse.status === 200) {
        console.log('✅ Admin levels accessible');
        console.log('Admin levels found:', adminLevelsResponse.data.length || 'Unknown');
      } else if (adminLevelsResponse.status === 401) {
        console.log('ℹ️ Admin levels require authentication');
      } else {
        console.log('❌ Admin levels error:', adminLevelsResponse.status);
      }
    } catch (error) {
      console.log('ℹ️ Admin levels check failed (expected if not logged in)');
    }

    console.log('\n📋 Summary of the issue:');
    console.log('• Level 1 has an old local file path: /uploads/b1e1f76b-4c6c-45e1-a96e-533424e615b7.jpeg');
    console.log('• This path no longer exists because we switched to ImageKit');
    console.log('• The image needs to be re-uploaded through the new ImageKit system');
    
    console.log('\n🛠️ Solutions:');
    console.log('1. Go to your admin dashboard and re-upload the image for level 1');
    console.log('2. Or, temporarily remove the image from level 1 until you can re-upload it');
    console.log('3. The new ImageKit system will store images in the cloud, not locally');

  } catch (error) {
    console.error('❌ Error checking levels:', error.message);
  }
}

console.log('🔍 Image Issue Diagnostic Tool');
console.log('==============================\n');

checkLevelImages();
