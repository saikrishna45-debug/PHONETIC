import os
from collections.abc import Generator
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import Engine, create_engine, text
from sqlalchemy.orm import Session

BACKEND_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=BACKEND_ENV_PATH, override=False)


class DatabaseNotConfiguredError(RuntimeError):
    """Raised when DATABASE_URL is missing."""


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise DatabaseNotConfiguredError("DATABASE_URL is not configured.")
    return database_url


@lru_cache(maxsize=4)
def _engine_for_url(database_url: str) -> Engine:
    return create_engine(database_url, pool_pre_ping=True)


def get_engine() -> Engine:
    return _engine_for_url(get_database_url())


def get_db() -> Generator[Session, None, None]:
    with Session(get_engine()) as session:
        yield session


def check_database_connection() -> None:
    with get_engine().connect() as connection:
        connection.execute(text("SELECT 1"))