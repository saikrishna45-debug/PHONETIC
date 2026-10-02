# PHONETIC Database Foundation

PostgreSQL is accessed through SQLAlchemy 2.x with the `psycopg` driver. The schema is managed by Alembic; FastAPI does not create tables automatically during startup.

## Configuration

Set `DATABASE_URL` in the backend environment. The root `.env.example` contains a local PostgreSQL URL template. Replace its placeholder password locally; do not commit real credentials.

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:your_password@localhost:5432/phonetic"
```

## Local Migrations

Run from the repository root after creating the `phonetic` database:

```powershell
.\backend\.venv\Scripts\python.exe -m alembic -c backend/alembic.ini upgrade head
```

The initial migration creates `users`, `user_preferences`, `saved_phones`, `resale_predictions`, `recommendation_history`, and `comparison_history`. Later schema changes should be added as new Alembic revisions.

## Health Checks

- `GET /api/health` checks that the FastAPI process is responding.
- `GET /api/database/health` runs a read-only `SELECT 1`; it returns HTTP 503 if `DATABASE_URL` is missing or PostgreSQL cannot be reached.

The database foundation is not yet used by the Buy/Sell flows, and no authentication behavior is implemented.
