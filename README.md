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

## API Usage

```bash
# Create lead
curl -X POST https://YOUR_API_URL/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"nama":"John","kontak":"+62812345678","caseType":"consultation","description":"Need advice","source":"website"}'

# List by status
curl "https://YOUR_API_URL/v1/leads?status=pending"

# Get by ID
curl "https://YOUR_API_URL/v1/leads/{leadId}"

# Update status
curl -X PATCH "https://YOUR_API_URL/v1/leads/{leadId}" \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}'
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
