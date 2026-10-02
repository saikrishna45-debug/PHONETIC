import os
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parents[2]
project_root_string = str(PROJECT_ROOT)
if project_root_string not in sys.path:
    sys.path.insert(0, project_root_string)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")

frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    origin.strip()
    for origin in frontend_urls.split(",")
    if origin.strip()
]

app = FastAPI(title="PHONETIC API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.health import router as health_router
from app.api.database import router as database_router
from app.api.recommendations import router as recommendations_router
from app.api.resale import router as resale_router

app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(database_router, prefix="/api", tags=["database"])
app.include_router(recommendations_router, prefix="/api", tags=["recommendations"])
app.include_router(resale_router, prefix="/api/resale", tags=["resale"])