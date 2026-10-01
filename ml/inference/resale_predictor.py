"""
PHONETIC — Resale Value Prediction
Reusable inference module for the trained resale model.

Model artifacts:
    ml/models/resale/resale_model.joblib
    ml/models/resale/resale_preprocessor.joblib
    ml/models/resale/metadata.json
    ml/models/resale/feature_names.json
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

import joblib
import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

# resale_predictor.py
#     ↓
# inference/
#     ↓
# ml/
#     ↓
# PHONETIC/

PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_DIR = PROJECT_ROOT / "ml" / "models" / "resale"

MODEL_PATH = MODEL_DIR / "resale_model.joblib"
PREPROCESSOR_PATH = MODEL_DIR / "resale_preprocessor.joblib"


# ============================================================
# EXPECTED INPUT FEATURES
# ============================================================

NUMERICAL_FEATURES = [
    "launch_price_inr",
    "launch_year",
    "age_years",
    "ram_gb",
    "storage_gb",
    "display_hz",
    "battery_health_pct",
    "camera_mp",
]

CATEGORICAL_FEATURES = [
    "brand",
    "model",
    "processor",
    "condition",
    "screen_crack",
    "scratches",
    "box",
    "charger",
    "invoice",
    "warranty",
    "network",
    "repair_history",
    "seller_type",
]

EXPECTED_FEATURES = (
    NUMERICAL_FEATURES
    + CATEGORICAL_FEATURES
)


# ============================================================
# MODEL LOADING
# ============================================================

_model = None
_preprocessor = None


def load_model() -> None:
    """
    Load the trained model and preprocessing pipeline.

    The artifacts are loaded once and reused for subsequent
    predictions.
    """

    global _model
    global _preprocessor

    if _model is not None and _preprocessor is not None:
        return

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Resale model not found at: {MODEL_PATH}"
        )

    if not PREPROCESSOR_PATH.exists():
        raise FileNotFoundError(
            f"Resale preprocessor not found at: "
            f"{PREPROCESSOR_PATH}"
        )

    _preprocessor = joblib.load(PREPROCESSOR_PATH)
    _model = joblib.load(MODEL_PATH)


# ============================================================
# INPUT VALIDATION
# ============================================================

def validate_input(phone_data: Dict[str, Any]) -> None:
    """
    Validate that all required model features are present.
    """

    missing_features = [
        feature
        for feature in EXPECTED_FEATURES
        if feature not in phone_data
    ]

    if missing_features:
        raise ValueError(
            "Missing required features: "
            + ", ".join(missing_features)
        )


# ============================================================
# PREDICTION
# ============================================================

def predict_resale_price(
    phone_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Predict the estimated resale price of a smartphone.

    Parameters
    ----------
    phone_data:
        Dictionary containing the 21 features expected by
        the trained resale model.

    Returns
    -------
    Dictionary containing the predicted resale price.
    """

    # --------------------------------------------------------
    # 1. Validate input
    # --------------------------------------------------------

    validate_input(phone_data)

    # --------------------------------------------------------
    # 2. Load trained artifacts
    # --------------------------------------------------------

    load_model()

    # --------------------------------------------------------
    # 3. Convert input into DataFrame
    # --------------------------------------------------------

    input_df = pd.DataFrame(
        [phone_data],
        columns=EXPECTED_FEATURES,
    )

    # --------------------------------------------------------
    # 4. Preprocess input
    # --------------------------------------------------------

    processed_input = _preprocessor.transform(input_df)

    # --------------------------------------------------------
    # 5. Generate prediction
    # --------------------------------------------------------

    prediction = _model.predict(processed_input)

    predicted_price = float(prediction[0])

    # --------------------------------------------------------
    # 6. Safety check
    # --------------------------------------------------------

    if predicted_price < 0:
        predicted_price = 0.0

    # --------------------------------------------------------
    # 7. Application-friendly rounding
    # --------------------------------------------------------

    display_price = round(predicted_price / 100) * 100

    # --------------------------------------------------------
    # 8. Return structured result
    # --------------------------------------------------------

    return {
        "estimated_resale_price_inr": round(
            predicted_price,
            2,
        ),
        "display_price_inr": int(
            display_price
        ),
        "currency": "INR",
        "model_version": "v1",
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

def get_model_info() -> Dict[str, Any]:
    """
    Return basic information about the trained resale model.
    """

    load_model()

    return {
        "model_name": "Resale Value Predictor",
        "model_version": "v1",
        "algorithm": "GradientBoostingRegressor",
        "input_feature_count": len(
            EXPECTED_FEATURES
        ),
        "processed_feature_count": 93,
        "target": "estimated_resale_price_inr",
        "target_unit": "INR",
    }


# ============================================================
# LOCAL TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 70)
    print("PHONETIC — RESALE PREDICTOR TEST")
    print("=" * 70)

    test_phone = {
        "brand": "Apple",
        "model": "iPhone 15",
        "launch_price_inr": 79999,
        "launch_year": 2023,
        "age_years": 2,
        "ram_gb": 8,
        "storage_gb": 128,
        "processor": "A16 Bionic",
        "display_hz": 60,
        "battery_health_pct": 88,
        "camera_mp": 48,
        "condition": "Good",
        "screen_crack": "No",
        "scratches": "Minor",
        "box": "Yes",
        "charger": "Yes",
        "invoice": "Yes",
        "warranty": "No",
        "network": "5G",
        "repair_history": "No Repairs",
        "seller_type": "Individual",
    }

    print("\nTesting phone:")
    print(
        f"{test_phone['brand']} "
        f"{test_phone['model']}"
    )

    result = predict_resale_price(
        test_phone
    )

    print("\nPrediction:")
    print(result)

    print("\nModel information:")
    print(get_model_info())

    print("\n" + "=" * 70)
    print("RESALE PREDICTOR TEST COMPLETED")
    print("=" * 70)