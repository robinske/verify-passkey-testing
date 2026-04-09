#!/usr/bin/env node
// Delete a Verify service (useful for cleanup after testing)

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import * as readline from 'readline';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('Error: .env file not found. Copy .env.example to .env and configure your credentials.');
  process.exit(1);
}

dotenv.config({ path: envPath });

// Validate required variables
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('Error: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

// Check if SERVICE_SID is provided as argument
const SERVICE_SID = process.argv[2];

if (!SERVICE_SID) {
  console.log('Usage: node 05-delete-service.js <SERVICE_SID>');
  console.log('');
  console.log('Example: node 05-delete-service.js VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('');
  console.log('To get a list of your services, run: node 03-list-services.js');
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function deleteService() {
  console.log(`⚠️  WARNING: This will permanently delete service ${SERVICE_SID}`);
  await askConfirmation('Press Enter to continue or Ctrl+C to cancel...');

  console.log(`Deleting service ${SERVICE_SID}...`);
  console.log('==============================================');

  try {
    await client.verify.v2.services(SERVICE_SID).remove();
    console.log('✓ Service deleted successfully!');
  } catch (error) {
    console.error('Error deleting service:');
    console.error(error.message);
    if (error.moreInfo) {
      console.error('More info:', error.moreInfo);
    }
    process.exit(1);
  }
}

deleteService();
