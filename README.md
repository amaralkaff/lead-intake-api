# Lead Intake API

Serverless REST API for managing sales leads using AWS Lambda, API Gateway, and DynamoDB.

## Tech Stack
- AWS CDK (TypeScript)
- Lambda (Node.js 20.x)
- API Gateway REST API
- DynamoDB with GSI

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/leads` | Create new lead |
| GET | `/leads/{id}` | Get lead by ID |
| GET | `/leads?status=pending` | List leads by status |
| PATCH | `/leads/{id}` | Update lead status |

## Lead Status Flow
```
pending → contacted → qualified → rejected
```

## Quick Start

```bash
# Install dependencies
npm install

# Deploy to AWS
npm run deploy

# Destroy stack
npm run destroy
```

## API Usage (PowerShell)

```powershell
# Create lead
curl -Method Post "https://YOUR_API_URL/v1/leads" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"nama":"John","kontak":"+62812345678","caseType":"consultation","description":"Need advice","source":"website"}'

# List by status
curl -Method Get "https://YOUR_API_URL/v1/leads?status=pending" `
  -Headers @{ "Content-Type" = "application/json" }

# Get by ID
curl -Method Get "https://YOUR_API_URL/v1/leads/{leadId}" `
  -Headers @{ "Content-Type" = "application/json" }

# Update status (allowed: qualified, rejected)
curl -Method Patch "https://YOUR_API_URL/v1/leads/{leadId}" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"status":"qualified"}'
```

## Project Structure
```
├── lib/constructs/     # CDK constructs (DynamoDB, Lambda, API GW)
├── src/handlers/       # Lambda handlers
├── src/services/       # DynamoDB operations
├── src/validators/     # Input validation
└── src/utils/          # Response builders, errors
```

## License
MIT
