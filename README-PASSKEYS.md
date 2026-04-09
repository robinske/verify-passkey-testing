# Twilio Verify Passkeys - Testing Scripts

This repository contains Node.js scripts to test and explore Twilio Verify passkey functionality. Use these scripts to learn how to configure passkeys, test the API, and understand the integration before implementing in your application.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Twilio credentials

# 3. List your existing services
npm run list

# 4. Create a new service with passkeys OR update an existing one (see below)
```

## Key Capabilities

✅ **Update Existing Services** - You can add passkeys to existing Verify services without creating new ones  
✅ **Create New Services** - Create services with passkeys enabled from the start  
✅ **Full Configuration** - Configure relying party details, authenticator types, and user verification

## Important: Parameter Naming

The Twilio Node.js SDK requires specific parameter naming for passkeys (note the lowercase `r` in `relyingParty`):
- `passkeys.relyingParty.id` - Your domain
- `passkeys.relyingParty.name` - Display name
- `passkeys.relyingParty.origins` - Allowed origins (comma-separated)
- `passkeys.authenticatorAttachment` - Authenticator type
- `passkeys.discoverableCredentials` - Credential discovery
- `passkeys.userVerification` - User verification level

## Environment Setup

Edit your `.env` file with:

1. **Twilio Credentials** (from https://console.twilio.com)
   - `TWILIO_ACCOUNT_SID` - Your Account SID (starts with AC)
   - `TWILIO_AUTH_TOKEN` - Your Auth Token

2. **Passkey Configuration** (customize for your application)
   - `RELYING_PARTY_ID` - Your domain (e.g., `myapp.com` or `localhost` for testing)
   - `RELYING_PARTY_NAME` - Your application name (shown to users)
   - `RELYING_PARTY_ORIGINS` - Comma-separated URLs (e.g., `https://myapp.com,https://www.myapp.com`)

**Example:**
```
RELYING_PARTY_ID=myapp.com
RELYING_PARTY_NAME=My Application
RELYING_PARTY_ORIGINS=https://myapp.com,https://app.myapp.com
```

## Available Scripts

### 1. List All Services
**When to use:** Start here to see your existing services  
**Usage:**
```bash
npm run list
```
Lists all Verify services in your account and shows which ones have passkeys enabled.

### 2. Create a New Service with Passkeys
**When to use:** Creating a new service from scratch  
**Usage:**
```bash
npm run create
```
Creates a brand new Verify service with passkeys enabled using the configuration from your `.env` file.

### 3. Update Existing Service to Add Passkeys
**When to use:** Adding passkeys to a service that already exists  
**Usage:**
```bash
npm run update -- <SERVICE_SID>
```
**Example:**
```bash
npm run update -- VAc8ea67d8cec0f49fa97acf4841b24ca8
```
Updates an existing service to enable passkey support. Get the SERVICE_SID by running `npm run list` first.

### 4. Get Service Details
**When to use:** Viewing full configuration of a specific service  
**Usage:**
```bash
npm run details -- <SERVICE_SID>
```
**Example:**
```bash
npm run details -- VAc8ea67d8cec0f49fa97acf4841b24ca8
```
Shows detailed configuration including all passkey settings.

### 5. Delete Service (Cleanup)
**When to use:** Removing test services  
**Usage:**
```bash
npm run delete -- <SERVICE_SID>
```
**Example:**
```bash
npm run delete -- VAc8ea67d8cec0f49fa97acf4841b24ca8
```
⚠️ **Warning:** This permanently deletes the service. You'll be prompted to confirm.

## Passkey Configuration Parameters

Understanding the parameters configured by these scripts:

### Relying Party Settings
- **`id`**: Your domain without protocol (e.g., `example.com`)  
  Must match your actual domain. Use `localhost` for local development.
  
- **`name`**: Your application's display name (e.g., "My App Name")  
  Shown to users during passkey registration and authentication.
  
- **`origins`**: Comma-separated full URLs (e.g., `https://example.com,https://www.example.com`)  
  Must include protocol (https://) and port if not 443. `http://localhost:3000` works for development.

### Authenticator Settings

**`authenticatorAttachment`** - Which authenticators are allowed:
- `platform` - Only built-in authenticators (Face ID, Touch ID, Windows Hello)
  - **Use when:** Mobile apps, high-security requirements
- `cross-platform` - Only external authenticators (security keys like YubiKey)
  - **Use when:** Enterprise environments requiring hardware keys
- `any` - Any authenticator type (default, most flexible)
  - **Use when:** Consumer apps, maximum compatibility

**`discoverableCredentials`** - Whether credentials can be discovered without username:
- `required` - Must support username-less login
  - **Use when:** Modern devices only, best UX
- `preferred` - Use if available, fall back if not (default)
  - **Use when:** Broad compatibility, graceful degradation
- `discouraged` - Always require username
  - **Use when:** Legacy systems, specific security policies

**`userVerification`** - Biometric/PIN verification level:
- `required` - Must verify user identity (biometric or PIN)
  - **Use when:** High-security transactions, regulated industries
- `preferred` - Verify if available (default)
  - **Use when:** General applications, balance of security and UX
- `discouraged` - Don't require verification (device presence only)
  - **Use when:** Low-risk operations, frictionless experiences

## Testing Workflows

### Recommended: Update Existing Service
**Choose this if:** You already have a Verify service in production or testing

```bash
# Step 1: Find your service SID
npm run list

# Step 2: Update the service with passkeys
npm run update -- VAxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Step 3: Verify the configuration
npm run details -- VAxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Why this approach?**
- No need to update your application code with a new SID
- Preserves existing service history and configuration
- Safer for production environments

### Alternative: Create New Service
**Choose this if:** You're starting fresh or testing passkeys in isolation

```bash
# Step 1: Create a new service
npm run create
# Save the returned SID: VA...

# Step 2: Verify the configuration
npm run details -- VA...returned-sid...

# Step 3: Clean up when done testing
npm run delete -- VA...returned-sid...
```

**Why this approach?**
- Clean slate for testing
- No risk to existing services
- Easy to delete when finished

## Important Requirements

### HTTPS & Origins
- **Production**: HTTPS is required - passkeys will not work over HTTP in production
- **Development**: `http://localhost` and `http://localhost:<port>` work without HTTPS
- **Origins must be exact**: Include protocol, domain, and port
  - ✅ Correct: `https://app.example.com`, `http://localhost:3000`
  - ❌ Wrong: `example.com`, `www.example.com` (missing protocol)

### Domain Configuration
- **`RELYING_PARTY_ID`** must match your actual domain (no protocol, no port)
  - Production: `example.com` or `app.example.com`
  - Development: `localhost` (not `localhost:3000`)
- Subdomains work: `RELYING_PARTY_ID=example.com` allows `app.example.com`, `www.example.com`, etc.

### Security
- ⚠️ **Never commit `.env`** - It contains your Auth Token
- The `.gitignore` already excludes `.env` - keep it that way
- Rotate your Auth Token if accidentally exposed

## Troubleshooting

### Error: "The requested resource was not found" (20404)
**Cause:** Invalid Service SID or service was deleted  
**Fix:** Run `npm run list` to see valid service SIDs

### Error: "Unable to create record: Authentication Error" (20003)
**Cause:** Invalid Twilio credentials  
**Fix:** 
1. Verify your Account SID starts with `AC`
2. Get a fresh Auth Token from https://console.twilio.com
3. Check for extra spaces in your `.env` file

### Error: "Invalid parameter" when setting passkeys
**Cause:** Domain or origin format error  
**Fix:**
1. Remove `https://` from `RELYING_PARTY_ID` (domain only)
2. Include `https://` in `RELYING_PARTY_ORIGINS` (full URLs)
3. For localhost: use `localhost` as ID, `http://localhost:3000` as origin

### Script requires SERVICE_SID
**Cause:** Missing command-line argument  
**Fix:** Run `npm run list` first to get your SID, then:
```bash
npm run update -- VA1234...
```

## What This Repository Does

These scripts **configure the Verify service** to support passkeys. This is a one-time setup step.

**What's included:**
- ✅ Service configuration via Twilio API
- ✅ Testing and validation scripts
- ✅ Learning how passkey parameters work

**What's NOT included:**
- ❌ Frontend passkey implementation (WebAuthn API)
- ❌ Backend verification logic
- ❌ User registration/authentication flows

## Next Steps: Building Your Application

After configuring your service with these scripts, you'll need to implement passkeys in your application:

### 1. Frontend (Client-Side)
- Use the [WebAuthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) or a library like [@simplewebauthn/browser](https://simplewebauthn.dev/)
- Implement passkey registration (create credential)
- Implement passkey authentication (get credential)

### 2. Backend (Server-Side)
- Use the [Twilio Verify SDK](https://www.twilio.com/docs/verify/quickstarts/passkeys) to verify credentials
- Create verification challenges
- Validate passkey assertions

### 3. Resources
- [Twilio Verify Passkeys Documentation](https://www.twilio.com/docs/verify/api/passkeys)
- [Twilio Passkeys Quickstart](https://www.twilio.com/docs/verify/quickstarts/passkeys)
- [WebAuthn Guide](https://webauthn.guide/)

---

**Questions or Issues?** Check the troubleshooting section above or refer to [Twilio Verify API documentation](https://www.twilio.com/docs/verify/api).
