# Consentir Server

This is the server component of the Consentir application, handling the storage of privacy settings using IPFS (via Helia).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on http://localhost:3001

## API Endpoints

### POST /store-settings
Stores privacy settings in IPFS and returns the CID.

Request body:
```json
{
  "settings": {
    "autoBlur": boolean,
    "requirePayment": boolean,
    "price": string,
    "privacyLevel": string,
    "allowDataSharing": boolean,
    "dataRetentionDays": string
  }
}
```

Response:
```json
{
  "cid": "string",
  "data": {
    "settings": {
      // settings object
    }
  }
}
``` 