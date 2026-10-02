from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.comparison_history import ComparisonHistory
    from app.models.recommendation_history import RecommendationHistory
    from app.models.resale_prediction import ResalePrediction
    from app.models.saved_phone import SavedPhone
    from app.models.user_preferences import UserPreferences


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    preferences: Mapped["UserPreferences | None"] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
    )
    saved_phones: Mapped[list["SavedPhone"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    resale_predictions: Mapped[list["ResalePrediction"]] = relationship(
        back_populates="user", passive_deletes=True
    )
    recommendation_history: Mapped[list["RecommendationHistory"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    comparison_history: Mapped[list["ComparisonHistory"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )