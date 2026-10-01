import logging
from typing import Any

from ml.inference.resale_predictor import predict_resale_price

from app.schemas.resale import ResalePredictionRequest

logger = logging.getLogger(__name__)


class ResaleArtifactsUnavailableError(Exception):
    """Raised when the trained resale artifacts cannot be loaded."""


class ResaleInferenceError(Exception):
    """Raised when resale inference fails unexpectedly."""


def predict_resale(phone_data: ResalePredictionRequest) -> dict[str, Any]:
    try:
        return predict_resale_price(phone_data.model_dump())
    except FileNotFoundError as error:
        logger.exception("Resale model artifacts are unavailable")
        raise ResaleArtifactsUnavailableError from error
    except Exception as error:
        logger.exception("Resale inference failed")
        raise ResaleInferenceError from error