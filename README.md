# Solana Wallet Generator with API

This project generates Solana wallets and keypairs with specific patterns and provides REST API endpoints to retrieve them.

## Features

- **Random Wallet Generation**: Generates random Solana wallets every 1-5 minutes
- **PumpFun Keypairs**: Continuously generates keypairs ending with "pump"
- **LetBonk Keypairs**: Continuously generates keypairs ending with "bonk"
- **REST API**: HTTP endpoints to retrieve generated wallets and keypairs

## Installation

```bash
npm install
```

## Usage

### Start the Service

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The service will start both the wallet generation processes and the HTTP API server.

### API Endpoints

#### Health Check
```
GET /health
```
Returns the service status.

#### Get Random Wallets
```
GET /api/wallets/random?limit=10
```
Retrieves random generated wallets. The `limit` parameter is optional (default: 10).

**Response:**
```json
{
  "success": true,
  "count": 10,
  "wallets": [
    {
      "publicKey": "ABC123...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get PumpFun Keypairs
```
GET /api/wallets/pumpfun?limit=10
```
Retrieves PumpFun keypairs ending with "pump". The `limit` parameter is optional (default: 10).

#### Get LetBonk Keypairs
```
GET /api/wallets/letbonk?limit=10
```
Retrieves LetBonk keypairs ending with "bonk". The `limit` parameter is optional (default: 10).

#### Get All Wallet Types
```
GET /api/wallets/all?limit=10
```
Retrieves all types of wallets and keypairs in a single request.

**Response:**
```json
{
  "success": true,
  "randomWallets": {
    "count": 10,
    "wallets": [...]
  },
  "pumpFunKeypairs": {
    "count": 10,
    "keypairs": [...]
  },
  "letBonkKeypairs": {
    "count": 10,
    "keypairs": [...]
  }
}
```

## Configuration

Set the following environment variables:

- `PORT`: API server port (default: 3000)
- `DB_URL`: MongoDB connection URL (default: mongodb://localhost:27017)
- `DB_NAME`: Database name (default: solana-wallets-db)

## Notes

- Wallets and keypairs are removed from the database after being retrieved via API
- The service runs continuously, generating new wallets and keypairs
- All API responses include a `success` flag and proper error handling
- The service uses non-blocking operations to maintain performance


