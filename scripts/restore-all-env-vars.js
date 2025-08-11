#!/usr/bin/env node

/**
 * Script to restore ALL environment variables for lateral-puzzles
 * This will restore the complete configuration
 */

const https = require('https');

// Configuration
const RENDER_API_KEY = 'rnd_d43Lz1rGHFUdIQADibYOFbxRV3d2';
const SERVICE_ID = 'srv-d2bomkruibrs73fqpqv0';

// ALL environment variables that should be set
const ALL_ENV_VARS = [
  {
    key: 'NODE_ENV',
    value: 'production',
    sync: false
  },
  {
    key: 'DATABASE_URL',
    value: 'postgresql://lateral_puzzles_user:JpuS9y9YAp9CvU4vaE2ujyOn4qtET2vV@dpg-d2bp7315pdvs73d0f260-a/lateral_puzzles',
    sync: false
  },
  {
    key: 'NEXTAUTH_SECRET',
    value: 'a22de9a9331ac34230f87dd4a0d8d713dab6d481b9f8ef90170c6a990c4b9d1d',
    sync: false
  },
  {
    key: 'NEXTAUTH_URL',
    value: 'https://lateral-puzzles.onrender.com',
    sync: false
  },
  {
    key: 'GOOGLE_CLIENT_ID',
    value: '90760514988-j391bukslsj4vst39kksov5cm2i6cv2l.apps.googleusercontent.com',
    sync: false
  },
  {
    key: 'GOOGLE_CLIENT_SECRET',
    value: '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',
    sync: false
  },
  {
    key: 'RESEND_API_KEY',
    value: 'your_resend_api_key_here',
    sync: false
  },
  {
    key: 'EMAIL_FROM',
    value: 'noreply@lateral-puzzles.com',
    sync: false
  },
  {
    key: 'UPSTASH_REDIS_REST_URL',
    value: 'your_upstash_redis_url_here',
    sync: false
  },
  {
    key: 'UPSTASH_REDIS_REST_TOKEN',
    value: 'your_upstash_redis_token_here',
    sync: false
  },
  {
    key: 'IMAGEKIT_PUBLIC_KEY',
    value: 'public_CqYvnU6KUN2LGW8bo6NQctkkMYU=',
    sync: false
  },
  {
    key: 'IMAGEKIT_PRIVATE_KEY',
    value: 'private_bmNlN9wkmpBV+7H0OWRIEEQzhhE=',
    sync: false
  },
  {
    key: 'IMAGEKIT_URL_ENDPOINT',
    value: 'https://ik.imagekit.io/puzzle',
    sync: false
  }
];

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function restoreAllEnvironmentVariables() {
  try {
    console.log('🚀 Restoring ALL environment variables for lateral-puzzles...');
    console.log(`📍 Service ID: ${SERVICE_ID}`);
    console.log(`📝 Total variables to restore: ${ALL_ENV_VARS.length}`);
    
    // Show what we're about to set
    console.log('\n📋 Variables to be restored:');
    ALL_ENV_VARS.forEach((envVar, index) => {
      const value = envVar.key.includes('SECRET') || envVar.key.includes('KEY') || envVar.key.includes('TOKEN') 
        ? envVar.value.substring(0, 10) + '...' 
        : envVar.value;
      console.log(`${index + 1}. ${envVar.key} = ${value}`);
    });
    
    console.log('\n📝 Updating environment variables...');
    
    // Update environment variables
    const updateOptions = {
      hostname: 'api.render.com',
      port: 443,
      path: `/v1/services/${SERVICE_ID}/env-vars`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const updateResult = await makeRequest(updateOptions, ALL_ENV_VARS);
    
    if (updateResult.status === 200) {
      console.log('\n✅ ALL environment variables restored successfully!');
      console.log('🔄 Your lateral-puzzles service will restart automatically with the complete configuration.');
      console.log('🌐 Check your service at: https://lateral-puzzles.onrender.com');
      
      // Verify the update
      console.log('\n🔍 Verifying the update...');
      const verifyOptions = {
        hostname: 'api.render.com',
        port: 443,
        path: `/v1/services/${SERVICE_ID}/env-vars`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      };
      
      const verifyResult = await makeRequest(verifyOptions);
      if (verifyResult.status === 200) {
        console.log(`✅ Verification complete: ${verifyResult.data.length} environment variables are now set`);
      }
      
    } else {
      console.error('❌ Failed to restore environment variables:', updateResult.data);
    }
    
  } catch (error) {
    console.error('❌ Error restoring environment variables:', error.message);
  }
}

console.log('🔑 Using Render API Key:', RENDER_API_KEY.substring(0, 10) + '...');
console.log('🎯 Target Service: lateral-puzzles');
console.log('');

restoreAllEnvironmentVariables();
