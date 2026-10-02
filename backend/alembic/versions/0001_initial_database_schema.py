"""Create the initial PHONETIC database schema.

Revision ID: 0001_initial_database_schema
Revises:
Create Date: 2026-10-02
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial_database_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "comparison_history",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("phone_ids", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_comparison_history_user_created_at",
        "comparison_history",
        ["user_id", "created_at"],
    )

    op.create_table(
        "recommendation_history",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("request_data", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("recommendation_data", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_recommendation_history_user_created_at",
        "recommendation_history",
        ["user_id", "created_at"],
    )

    op.create_table(
        "resale_predictions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("phone_brand", sa.String(length=80), nullable=False),
        sa.Column("phone_model", sa.String(length=180), nullable=False),
        sa.Column("predicted_resale_price", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("currency", sa.String(length=3), server_default="INR", nullable=False),
        sa.Column("model_version", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_resale_predictions_user_created_at",
        "resale_predictions",
        ["user_id", "created_at"],
    )

    op.create_table(
        "saved_phones",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("phone_id", sa.String(length=255), nullable=False),
        sa.Column("brand", sa.String(length=80), nullable=True),
        sa.Column("model", sa.String(length=180), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "phone_id", name="uq_saved_phones_user_phone"),
    )
    op.create_index("ix_saved_phones_user_id", "saved_phones", ["user_id"])

    op.create_table(
        "user_preferences",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("purpose", sa.String(length=80), nullable=True),
        sa.Column("phone_type", sa.String(length=20), nullable=True),
        sa.Column("budget_min", sa.Integer(), nullable=True),
        sa.Column("budget_max", sa.Integer(), nullable=True),
        sa.Column("usage", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("min_ram_gb", sa.Integer(), nullable=True),
        sa.Column("min_storage_gb", sa.Integer(), nullable=True),
        sa.Column("requires_5g", sa.Boolean(), nullable=True),
        sa.Column("min_battery_mah", sa.Float(), nullable=True),
        sa.Column("preferred_display_min", sa.Float(), nullable=True),
        sa.Column("preferred_display_max", sa.Float(), nullable=True),
        sa.Column("battery_preference", sa.String(length=20), nullable=True),
        sa.Column("display_preference", sa.String(length=20), nullable=True),
        sa.Column("camera_preference", sa.String(length=20), nullable=True),
        sa.Column("performance_preference", sa.String(length=20), nullable=True),
        sa.Column("priority_preferences", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_user_preferences_user_id"),
    )


def downgrade() -> None:
    op.drop_table("user_preferences")
    op.drop_index("ix_saved_phones_user_id", table_name="saved_phones")
    op.drop_table("saved_phones")
    op.drop_index("ix_resale_predictions_user_created_at", table_name="resale_predictions")
    op.drop_table("resale_predictions")
    op.drop_index(
        "ix_recommendation_history_user_created_at", table_name="recommendation_history"
    )
    op.drop_table("recommendation_history")
    op.drop_index("ix_comparison_history_user_created_at", table_name="comparison_history")
    op.drop_table("comparison_history")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")