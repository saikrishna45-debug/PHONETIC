# Deployment Architecture

- **Frontend**: Vercel / Docker Container
- **Backend API**: Dockerized FastAPI on AWS ECS / Render / Fly.io
- **Database**: Managed PostgreSQL (AWS RDS / Supabase / Neon)
- **Model Storage**: S3 or local container volume with versioning
