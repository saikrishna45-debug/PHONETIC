# Machine Learning Strategy & Specification

## Work Environment
Model training, EDA, and validation are conducted in **Google Colab**.
Only serialized model artifacts, preprocessing routines, and lightweight inference code live in `ml/`.

## Tasks

### 1. Resale Value Prediction
- **Task Type**: Regression
- **Target**: Resale Price (USD / INR)
- **Features**: Brand, Model, Age (months since release), RAM, Storage, Condition (Pristine, Good, Fair, Damaged), Battery Health (%), Screen Scratches (Y/N), Original Accessories included (Y/N)
- **Algorithms Evaluated**: XGBoost Regressor, LightGBM, Random Forest, Ridge Regression
- **Explainability**: SHAP (SHapley Additive exPlanations) values indicating feature contributions to value loss

### 2. Smartphone Recommendation Engine
- **Task Type**: Multi-criteria weighted ranking & filtering
- **Input**: Budget ceiling, primary usage (Gaming, Photography, Battery, Everyday), Brand preferences, OS preference
- **Algorithm**: Feature normalization + weighted cosine similarity / TOPSIS ranking
