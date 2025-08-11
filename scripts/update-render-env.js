#!/usr/bin/env node

/**
 * Script to update Render environment variables
 * Usage: node scripts/update-render-env.js
 */

const https = require('https');

// Configuration - UPDATE THESE VALUES
const RENDER_API_KEY = 'YOUR_RENDER_API_KEY_HERE'; // Get from https://render.com/docs/api#authentication
const SERVICE_ID = 'YOUR_SERVICE_ID_HERE'; // Get from your service URL or dashboard
const TEAM_ID = 'YOUR_TEAM_ID_HERE'; // Optional, only if you have multiple teams

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
    console.log('🚀 Updating Render environment variables...');
    
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
      }
    });
    
    // Add new ImageKit environment variables
    Object.entries(ENV_VARS).forEach(([key, value]) => {
      newEnvVars.push({
        key,
        value,
        sync: false
      });
    });
    
    console.log('📝 Updating environment variables...');
    console.log('New variables to be set:', newEnvVars.map(v => `${v.key}=${v.value}`).join('\n'));
    
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
      console.log('🔄 Your service will restart automatically with the new variables.');
    } else {
      console.error('❌ Failed to update environment variables:', updateResult.data);
    }
    
  } catch (error) {
    console.error('❌ Error updating environment variables:', error.message);
  }
}

// Check if required values are set
if (RENDER_API_KEY === 'YOUR_RENDER_API_KEY_HERE' || SERVICE_ID === 'YOUR_SERVICE_ID_HERE') {
  console.log('❌ Please update the configuration in this script first:');
  console.log('1. Get your Render API key from: https://render.com/docs/api#authentication');
  console.log('2. Get your service ID from your service URL or dashboard');
  console.log('3. Update the RENDER_API_KEY and SERVICE_ID variables in this script');
  process.exit(1);
}

updateEnvironmentVariables();
