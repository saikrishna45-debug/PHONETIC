# API Documentation & Contracts

## Base URL
`/api` (e.g. `http://localhost:8000/api`)

## Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Obtain JWT access token
- `GET /api/auth/me` - Current authenticated user profile

### Phones Catalog
- `GET /api/phones` - List phones with pagination, search, brand/price filters
- `GET /api/phones/{id}` - Retrieve detailed specs for a phone

### Resale Valuation
- `POST /api/resale/predict` - Calculate resale price prediction and confidence range
- `GET /api/resale/trends/{phone_id}` - Historical and projected depreciation curve

### Recommendations
- `POST /api/recommendations` - Submit questionnaire criteria and receive ranked phones
