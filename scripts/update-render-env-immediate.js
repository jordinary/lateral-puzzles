#!/usr/bin/env node

/**
 * Script to update Render environment variables for lateral-puzzles
 * This script is pre-configured with your credentials and service ID
 */

const https = require('https');

// Configuration - PRE-CONFIGURED with your values
const RENDER_API_KEY = 'rnd_d43Lz1rGHFUdIQADibYOFbxRV3d2';
const SERVICE_ID = 'srv-d2bomkruibrs73fqpqv0'; // lateral-puzzles service

// ImageKit environment variables to add/update
const ENV_VARS = {
  IMAGEKIT_PUBLIC_KEY: 'public_CqYvnU6KUN2LGW8bo6NQctkkMYU=',
  IMAGEKIT_PRIVATE_KEY: 'private_bmNlN9wkmpBV+7H0OWRIEEQzhhE=',
  IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/puzzle'
};

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

async function updateEnvironmentVariables() {
  try {
    console.log('🚀 Updating Render environment variables for lateral-puzzles...');
    console.log(`📍 Service ID: ${SERVICE_ID}`);
    
    // First, get current environment variables
    console.log('📋 Fetching current environment variables...');
    const getOptions = {
      hostname: 'api.render.com',
      port: 443,
      path: `/v1/services/${SERVICE_ID}/env-vars`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const currentEnv = await makeRequest(getOptions);
    
    if (currentEnv.status !== 200) {
      console.error('❌ Failed to fetch current environment variables:', currentEnv.data);
      return;
    }
    
    console.log('✅ Current environment variables fetched');
    
    // Prepare new environment variables
    const newEnvVars = [];
    
    // Add existing environment variables that we want to keep
    const keepVars = [
      'NODE_ENV', 'DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL',
      'RESEND_API_KEY', 'EMAIL_FROM', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'
    ];
    
    currentEnv.data.forEach(envVar => {
      if (keepVars.includes(envVar.key)) {
        newEnvVars.push({
          key: envVar.key,
          value: envVar.value,
          sync: false
        });
        console.log(`📝 Keeping: ${envVar.key}`);
      }
    });
    
    // Add new ImageKit environment variables
    Object.entries(ENV_VARS).forEach(([key, value]) => {
      newEnvVars.push({
        key,
        value,
        sync: false
      });
      console.log(`🆕 Adding: ${key}`);
    });
    
    console.log(`\n📝 Updating environment variables...`);
    console.log(`Total variables to be set: ${newEnvVars.length}`);
    
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
    
    const updateResult = await makeRequest(updateOptions, newEnvVars);
    
    if (updateResult.status === 200) {
      console.log('✅ Environment variables updated successfully!');
      console.log('🔄 Your lateral-puzzles service will restart automatically with the new variables.');
      console.log('🌐 Check your service at: https://lateral-puzzles.onrender.com');
    } else {
      console.error('❌ Failed to update environment variables:', updateResult.data);
    }
    
  } catch (error) {
    console.error('❌ Error updating environment variables:', error.message);
  }
}

console.log('�� Using Render API Key:', RENDER_API_KEY.substring(0, 10) + '...');
console.log('🎯 Target Service: lateral-puzzles');
console.log('');

updateEnvironmentVariables();
