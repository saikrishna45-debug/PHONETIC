from app.database.base import Base
from app.models.comparison_history import ComparisonHistory
from app.models.recommendation_history import RecommendationHistory
from app.models.resale_prediction import ResalePrediction
from app.models.saved_phone import SavedPhone
from app.models.user import User
from app.models.user_preferences import UserPreferences

__all__ = [
    "Base",
    "ComparisonHistory",
    "RecommendationHistory",
    "ResalePrediction",
    "SavedPhone",
    "User",
    "UserPreferences",
]