#!/usr/bin/env node
// Create a new Verify service with passkeys enabled

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
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  RELYING_PARTY_ID,
  RELYING_PARTY_NAME,
  RELYING_PARTY_ORIGINS
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('Error: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function createServiceWithPasskeys() {
  console.log('Creating new Verify service with passkeys enabled...');
  console.log('==============================================');

  const friendlyName = 'Passkey Test Service';

  try {
    const service = await client.verify.v2.services.create({
      friendlyName: friendlyName,
      'passkeys.relyingParty.id': RELYING_PARTY_ID,
      'passkeys.relyingParty.name': RELYING_PARTY_NAME,
      'passkeys.relyingParty.origins': RELYING_PARTY_ORIGINS,
      'passkeys.authenticatorAttachment': 'any',
      'passkeys.discoverableCredentials': 'preferred',
      'passkeys.userVerification': 'preferred'
    });

    // Pretty print the response
    console.log(JSON.stringify(service, null, 2));

    console.log('');
    console.log('✓ Service created successfully!');
    console.log(`Service SID: ${service.sid}`);
    console.log('');
    console.log('Save this SID for future operations:');
    console.log(`export SERVICE_SID=${service.sid}`);

  } catch (error) {
    console.error('Error creating service:');
    console.error(error.message);
    if (error.moreInfo) {
      console.error('More info:', error.moreInfo);
    }
    process.exit(1);
  }
}

createServiceWithPasskeys();
