from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.database.connection import (
    DatabaseNotConfiguredError,
    check_database_connection,
)

router = APIRouter()


@router.get("/database/health")
def get_database_health() -> dict[str, str]:
    try:
        check_database_connection()
    except DatabaseNotConfiguredError:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured.",
        ) from None
    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database is unavailable.",
        ) from None

    return {"status": "ok", "database": "reachable"}