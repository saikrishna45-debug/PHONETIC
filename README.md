# PHONETIC 📱✨

**AI/ML-Powered Smartphone Decision-Support Platform**

PHONETIC is an intelligent decision-support system designed to empower users with two core capabilities:
1. **Resale Value Prediction**: Accurate market-driven price estimation and depreciation insights for pre-owned smartphones using machine learning.
2. **Personalized Smartphone Recommendation**: Tailored device suggestions matching budget, usage habits, camera needs, battery life, performance, and brand affinity.

---

## 🏗 Planned System Architecture

```text
PHONETIC/
├── frontend/        # Next.js 15+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
├── backend/         # FastAPI REST API, SQLAlchemy / SQLModel, Pydantic, JWT Auth
├── ml/              # Inference scripts, exported model artifacts, preprocessing pipelines
├── data/            # Raw and processed datasets (experimentation done in Google Colab)
└── docs/            # Comprehensive architecture, API, and setup documentation
```

### End-to-End Workflow

```text
[Frontend (Next.js)]
       │
       ▼ (HTTP / REST)
[FastAPI Backend]
       │
       ├─── Authentication & User Profiles
       ├─── Saved Comparisons & History
       │
       ▼ (ML Inference Layer)
[Preprocessed Features] ──► [Trained Models (XGBoost / scikit-learn)] ──► [SHAP / Predictions]
```

> **Note on Machine Learning Workflow**: Model experimentation, EDA, feature engineering, hyperparameter tuning, and training are conducted primarily in **Google Colab**. Final validated model artifacts (`.joblib` / `.pkl`) are exported into `ml/models/` for local backend inference.

---

## 🚀 Incremental Development Roadmap

- [x] **Phase 1: Project Architecture & Frontend Scaffolding**
  - Next.js with TypeScript & App Router
  - Tailwind CSS & shadcn/ui component system
  - Complete application routing hierarchy
  - Strongly-typed mock data & frontend API abstraction layer
- [ ] **Phase 2: Frontend UI & Interactive Flow Implementation**
- [ ] **Phase 3: Machine Learning Model Training (Google Colab) & Export**
- [ ] **Phase 4: FastAPI Backend & ML Inference Engine**
- [ ] **Phase 5: PostgreSQL Database & Authentication**
- [ ] **Phase 6: Integration, Testing & Deployment**

---

## 🛠 Getting Started (Frontend)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
