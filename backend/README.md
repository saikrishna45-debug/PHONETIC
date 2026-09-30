# PHONETIC Backend (FastAPI)

> **Status: Planned (Phase 4)**

The PHONETIC backend will be built using Python and FastAPI. It provides the REST API endpoints consumed by the Next.js frontend and acts as the bridge to the ML inference layer and PostgreSQL database.

## Planned Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── auth.py
│   │   ├── phones.py
│   │   ├── resale.py
│   │   ├── recommendations.py
│   │   ├── compare.py
│   │   ├── insights.py
│   │   └── users.py
│   ├── models/
│   │   ├── user.py
│   │   ├── phone.py
│   │   ├── prediction.py
│   │   └── recommendation.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── phone.py
│   │   ├── resale.py
│   │   └── recommendation.py
│   ├── services/
│   │   ├── resale_service.py
│   │   ├── recommendation_service.py
│   │   └── comparison_service.py
│   ├── database/
│   │   ├── connection.py
│   │   └── session.py
│   └── core/
│       ├── config.py
│       └── security.py
├── tests/
├── requirements.txt
└── .env
```
