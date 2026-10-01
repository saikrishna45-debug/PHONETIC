from fastapi import APIRouter, HTTPException

from app.schemas.resale import ResalePredictionRequest, ResalePredictionResponse
from app.services.resale_service import (
    ResaleArtifactsUnavailableError,
    ResaleInferenceError,
    predict_resale,
)

router = APIRouter()


@router.post("/predict", response_model=ResalePredictionResponse)
def post_resale_prediction(
    phone_data: ResalePredictionRequest,
) -> ResalePredictionResponse:
    try:
        result = predict_resale(phone_data)
    except ResaleArtifactsUnavailableError:
        raise HTTPException(
            status_code=503,
            detail="Resale model artifacts are unavailable.",
        ) from None
    except ResaleInferenceError:
        raise HTTPException(
            status_code=500,
            detail="Resale prediction failed.",
        ) from None

    return ResalePredictionResponse(**result)