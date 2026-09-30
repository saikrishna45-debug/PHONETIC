# Backend Architecture & Documentation

## Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **ORM / Database Layer**: SQLAlchemy / SQLModel
- **Validation**: Pydantic v2
- **Auth**: JWT bearer authentication with bcrypt password hashing
- **ML Integration**: Direct joblib/scikit-learn/XGBoost inference pipelines

## Endpoints (Planned)
- `/api/auth`: Login, registration, profile retrieval
- `/api/phones`: Phone catalog, specifications, search & filter
- `/api/resale`: Resale valuation prediction, depreciation curves
- `/api/recommendations`: User preference questionnaire analysis & ranked matches
- `/api/compare`: Multi-phone specification diffs
- `/api/insights`: Market pricing shifts and platform trends
