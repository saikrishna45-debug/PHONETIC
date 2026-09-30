# PHONETIC Machine Learning Engine

> **Status: Planned (Phase 3 & Phase 4)**

## ML Development Workflow

- **Primary Experimentation Environment**: **Google Colab**
  - Dataset exploration & EDA
  - Preprocessing experiments & feature engineering
  - Model selection (XGBoost, Random Forest, LightGBM, scikit-learn)
  - Hyperparameter tuning & cross-validation
  - SHAP / Feature importance analysis
  - Exporting serialised artifacts (`.joblib` / `.pkl`)

- **Local `ml/` Directory Purpose**:
  - Exported trained model artifacts (`ml/models/`)
  - Inference preprocessing pipeline (`ml/preprocessing/`)
  - Prediction engine & recommendation algorithm (`ml/inference/`)
  - Model documentation and performance cards

## Planned Directory Structure

```text
ml/
├── models/
│   ├── resale/
│   └── recommendation/
├── inference/
│   ├── resale_predictor.py
│   └── recommendation_engine.py
├── preprocessing/
│   └── preprocessing.py
└── README.md
```
