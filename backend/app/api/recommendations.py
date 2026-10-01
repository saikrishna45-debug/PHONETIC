from fastapi import APIRouter, HTTPException, Query

from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import (
    RecommendationDatasetUnavailableError,
    RecommendationEngineError,
    get_recommendations,
)

router = APIRouter()


@router.post("/recommendations", response_model=RecommendationResponse)
def post_recommendations(
    preferences: RecommendationRequest,
    top_k: int = Query(default=5, ge=1, le=20),
) -> RecommendationResponse:
    try:
        recommendations = get_recommendations(preferences, top_k=top_k)
    except RecommendationDatasetUnavailableError:
        raise HTTPException(
            status_code=503,
            detail="Recommendation dataset is unavailable.",
        ) from None
    except RecommendationEngineError:
        raise HTTPException(
            status_code=500,
            detail="Recommendation generation failed.",
        ) from None

    return RecommendationResponse(recommendations=recommendations)