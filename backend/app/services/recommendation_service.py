import logging
from typing import Any

from ml.inference.recommendation_engine import recommend_phones

from app.schemas.recommendation import RecommendationRequest

logger = logging.getLogger(__name__)


class RecommendationDatasetUnavailableError(Exception):
    """Raised when the cleaned recommendation dataset cannot be loaded."""


class RecommendationEngineError(Exception):
    """Raised when recommendation inference fails unexpectedly."""


def get_recommendations(
    preferences: RecommendationRequest,
    top_k: int,
) -> list[dict[str, Any]]:
    engine_preferences = preferences.model_dump(exclude_none=True)
    try:
        return recommend_phones(engine_preferences, top_k=top_k)
    except FileNotFoundError as error:
        logger.exception("Recommendation dataset is unavailable")
        raise RecommendationDatasetUnavailableError from error
    except Exception as error:
        logger.exception("Recommendation inference failed")
        raise RecommendationEngineError from error