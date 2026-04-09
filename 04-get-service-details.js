#!/usr/bin/env node
// Get details of a specific Verify service

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
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
  console.log('Usage: node 04-get-service-details.js <SERVICE_SID>');
  console.log('');
  console.log('Example: node 04-get-service-details.js VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('');
  console.log('To get a list of your services, run: node 03-list-services.js');
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function getServiceDetails() {
  console.log(`Getting details for service ${SERVICE_SID}...`);
  console.log('==============================================');

  try {
    const service = await client.verify.v2.services(SERVICE_SID).fetch();

    // Pretty print the response
    console.log(JSON.stringify(service, null, 2));

    // Extract passkey configuration
    console.log('');
    console.log('Passkey Configuration:');
    console.log('==============================================');

    if (service.passkeys) {
      const passkeyConfig = {
        relying_party_id: service.passkeys.relying_party?.id || 'Not configured',
        relying_party_name: service.passkeys.relying_party?.name || 'Not configured',
        relying_party_origins: service.passkeys.relying_party?.origins || 'Not configured',
        authenticator_attachment: service.passkeys.authenticator_attachment || 'Not configured',
        discoverable_credentials: service.passkeys.discoverable_credentials || 'Not configured',
        user_verification: service.passkeys.user_verification || 'Not configured'
      };
      console.log(JSON.stringify(passkeyConfig, null, 2));
    } else {
      console.log('Passkeys not configured for this service.');
    }

  } catch (error) {
    console.error('Error getting service details:');
    console.error(error.message);
    if (error.moreInfo) {
      console.error('More info:', error.moreInfo);
    }
    process.exit(1);
  }
}

getServiceDetails();
