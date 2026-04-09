#!/usr/bin/env node
// List all Verify services in your account

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

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function listServices() {
  console.log('Listing all Verify services...');
  console.log('==============================================');

  try {
    const services = await client.verify.v2.services.list();

    // Pretty print the response
    console.log(JSON.stringify({ services }, null, 2));

    // Display service info in a readable format
    console.log('');
    console.log('Service Summary:');
    console.log('==============================================');

    if (services && services.length > 0) {
      services.forEach(service => {
        console.log(`SID: ${service.sid}`);
        console.log(`Name: ${service.friendlyName}`);

        if (service.passkeys && service.passkeys.relying_party?.id) {
          console.log(`Passkeys Enabled: Yes (${service.passkeys.relying_party.id})`);
        } else {
          console.log('Passkeys Enabled: No');
        }
        console.log('---');
      });
    } else {
      console.log('No services found.');
    }

  } catch (error) {
    console.error('Error listing services:');
    console.error(error.message);
    if (error.moreInfo) {
      console.error('More info:', error.moreInfo);
    }
    process.exit(1);
  }
}

listServices();
