from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class UserPreferences(Base):
    __tablename__ = "user_preferences"
    __table_args__ = (UniqueConstraint("user_id", name="uq_user_preferences_user_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    purpose: Mapped[str | None] = mapped_column(String(80))
    phone_type: Mapped[str | None] = mapped_column(String(20))
    budget_min: Mapped[int | None] = mapped_column(Integer)
    budget_max: Mapped[int | None] = mapped_column(Integer)
    usage: Mapped[list[str] | None] = mapped_column(JSONB)
    min_ram_gb: Mapped[int | None] = mapped_column(Integer)
    min_storage_gb: Mapped[int | None] = mapped_column(Integer)
    requires_5g: Mapped[bool | None]
    min_battery_mah: Mapped[float | None]
    preferred_display_min: Mapped[float | None]
    preferred_display_max: Mapped[float | None]
    battery_preference: Mapped[str | None] = mapped_column(String(20))
    display_preference: Mapped[str | None] = mapped_column(String(20))
    camera_preference: Mapped[str | None] = mapped_column(String(20))
    performance_preference: Mapped[str | None] = mapped_column(String(20))
    priority_preferences: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="preferences")