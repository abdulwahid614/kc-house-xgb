# King County House Price Prediction Service

A production-grade Machine Learning inference service and interactive web application for estimating residential real estate prices in King County, Washington (Seattle area). Powered by an optimized **XGBoost Regression Pipeline** ($R^2 = 0.8684$), served via **FastAPI**, with a responsive dual-theme (Dark/Light) web interface.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Machine Learning Model](#machine-learning-model)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Frontend Interface & Theme Engine](#frontend-interface--theme-engine)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Assumptions & Limitations](#assumptions--limitations)

---

## 🌟 Overview

This project operationalizes the trained model from `homework1.ipynb` into a production-ready application:
1. **FastAPI Backend**: Serves validated predictions via `POST /predict` and system readiness checks via `GET /health`.
2. **Interactive Single Page Application (SPA)**: Accessible, responsive user interface allowing users to adjust 18 real estate features or pick from preset King County home profiles.
3. **Phase 5 Theme Engine**: Instant single-click toggling between **Dark Mode** and **Light Mode** via a toggle button located at the **END of the main interface** (footer), featuring Sun ☀️ and Moon 🌙 icons, `localStorage` persistence, and OS color-scheme auto-detection.
4. **Resilient Client & Server**: Strict input validation via Pydantic, network and server error handling, loading spinners that prevent accidental duplicate submissions, and zero hardcoded prediction values.

---

## 🏗️ Project Architecture

```
D:\LMOPS\2\
├── app/
│   ├── __init__.py          # Application package declaration
│   ├── config.py            # System configuration & file paths
│   ├── schemas.py           # Pydantic models for validation & documentation
│   ├── model.py             # Model loading, feature alignment, and inference
│   ├── main.py              # FastAPI application, routes, and static mounting
│   └── static/              # Frontend client assets
│       ├── index.html       # Semantic HTML5 layout with preset cards & result display
│       ├── style.css        # CSS variables for Dark/Light mode, animations & layout
│       └── app.js           # Client logic: API fetch, validation, theme toggle, presets
├── tests/
│   ├── __init__.py          # Test suite declaration
│   ├── test_model.py        # Model loading, pipeline integrity, and derived feature tests
│   ├── test_api.py          # FastAPI endpoint integration, validation (422), and CORS tests
│   └── test_frontend.py     # Frontend integrity, static serving, and Theme Toggle tests
├── homework1.ipynb          # Original Jupyter Notebook with EDA & model training
├── kc_house_data.csv        # King County dataset (21,613 records)
├── kc_house_xgb_model.pkl   # Serialized Scikit-Learn XGBoost pipeline artifact
├── requirements.txt         # Pinned application dependencies
├── README.md                # Comprehensive project documentation
└── .gitignore               # Ignored cache, build, and temporary files
```

---

## 🧠 Machine Learning Model

- **Algorithm**: `XGBoost Regressor` wrapped inside an `sklearn.pipeline.Pipeline`.
- **Training Artifact**: `kc_house_xgb_model.pkl` (pre-trained on 80% split of 21,613 King County sales).
- **Performance Metrics**:
  - **$R^2$ Score**: `0.8684` (explains 86.8% of variance in market valuations)
  - **Test MAE**: `$69,818.94`
  - **Test RMSE**: `$141,055.41`
  - **Train RMSE**: `$75,481.92`
- **Feature Engineering**:
  The backend automatically derives and aligns the 20 columns required by the pipeline:
  - $\text{house\_age} = 2015 - \text{yr\_built}$
  - $\text{total\_rooms\_count} = \text{bedrooms} + \text{bathrooms}$
- **Top Valuation Drivers**:
  1. `grade` (27.65%): Construction quality and architectural finish.
  2. `waterfront` (22.22%): Direct water access.
  3. `sqft_living` (16.72%): Interior heated living space.
  4. `lat` / `long` (10.18%): Geographic location and neighborhood prestige.

---

## 💻 Installation & Setup

### Prerequisites
- Python 3.10, 3.11, 3.12, 3.13, or 3.14
- pip package manager

### 1. Clone or Open Project Directory
```powershell
cd D:\LMOPS\2
```

### 2. Create and Activate a Virtual Environment (Recommended)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

---

## 🚀 Running Locally

Start the local server using either `uvicorn` or the python module runner:

### Option A: Using Uvicorn (Recommended for Development)
```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Option B: Using Python Directly
```powershell
python -m app.main
```

Once running, access the local services:
- **Interactive Web Application**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Swagger Interactive API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Service Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 📡 API Endpoints

### 1. Health & Readiness Check
- **Route**: `GET /health`
- **Description**: Verifies that the service is running and the ML model is loaded in memory.
- **Example Response (200 OK)**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_type": "Pipeline",
  "version": "1.0.0"
}
```

---

### 2. House Price Prediction
- **Route**: `POST /predict`
- **Content-Type**: `application/json`
- **Description**: Ingests 18 raw property features, validates types and ranges, computes derived features, and returns a real predicted valuation.

#### Sample Request Payload:
```json
{
  "bedrooms": 3,
  "bathrooms": 2.25,
  "sqft_living": 2570,
  "sqft_lot": 7242,
  "floors": 2.0,
  "waterfront": 0,
  "view": 0,
  "condition": 3,
  "grade": 7,
  "sqft_above": 2170,
  "sqft_basement": 400,
  "yr_built": 1951,
  "yr_renovated": 1991,
  "zipcode": 98125,
  "lat": 47.7210,
  "long": -122.3190,
  "sqft_living15": 1690,
  "sqft_lot15": 7639
}
```

#### Sample Response (200 OK):
```json
{
  "predicted_price": 538421.15,
  "formatted_price": "$538,421.15",
  "currency": "USD",
  "model_name": "XGBoost Regressor (Pipeline)",
  "input_summary": {
    "bedrooms": 3,
    "bathrooms": 2.25,
    "sqft_living": 2570,
    "grade": 7,
    "condition": 3,
    "waterfront": false,
    "zipcode": 98125,
    "yr_built": 1951,
    "house_age": 64,
    "total_rooms_count": 5.25
  }
}
```

#### Example cURL Command:
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "bedrooms": 3,
       "bathrooms": 2.25,
       "sqft_living": 2570,
       "sqft_lot": 7242,
       "floors": 2.0,
       "waterfront": 0,
       "view": 0,
       "condition": 3,
       "grade": 7,
       "sqft_above": 2170,
       "sqft_basement": 400,
       "yr_built": 1951,
       "yr_renovated": 1991,
       "zipcode": 98125,
       "lat": 47.7210,
       "long": -122.3190,
       "sqft_living15": 1690,
       "sqft_lot15": 7639
     }'
```

---

## 🎨 Frontend Interface & Theme Engine

### 1. Prediction Form & Duplicate Prevention
- Form fields are grouped into logical sections: **Core Structure**, **Area & Living Space**, **Quality & Rating**, and **Location & Age**.
- When the user clicks **Calculate Estimated Price**:
  - The submit button is immediately disabled to prevent duplicate network calls.
  - An inline animated spinner appears with label "Calculating Prediction...".
  - If the API succeeds, the real estimated market value is displayed with counter animation and summary breakdown pills.
  - If a network error or 422 validation error occurs, an accessible error alert banner displays the exact issue.

### 2. Phase 5 Theme Toggle
- **Placement**: Located in the footer at the **END of the main interface** (`#themeToggleBtn`).
- **Icons**: Displays a Sun icon (`☀️`) for Light Mode and a Moon icon (`🌙`) for Dark Mode.
- **Single-Click Interaction**: Toggles between modes instantly with smooth CSS transitions on all backgrounds, cards, text, inputs, buttons, borders, and shadows.
- **Persistence**: Remembers the selected theme in `localStorage.getItem('kc_house_theme')` across page refreshes.
- **OS Fallback**: If no user preference is saved, automatically detects the operating system preference using `window.matchMedia('(prefers-color-scheme: dark)')`.
- **Zero API Interference**: The theme switcher operates purely on the presentation layer without affecting model inference or API communication.

---

## 🧪 Testing & Quality Assurance

The test suite is built with `pytest` and `fastapi.testclient.TestClient`.

### Running All Tests:
```powershell
python -m pytest -v
```

### Test Coverage Summary:
| Test File | Tests | Focus Area |
| :--- | :---: | :--- |
| `tests/test_model.py` | 4 | Model file verification, eager loading, 20-feature DataFrame alignment, derived feature computation, real inference. |
| `tests/test_api.py` | 7 | `GET /health`, `POST /predict` (valid), missing features (422), invalid types (422), out-of-range constraints (422), luxury waterfront cases, CORS headers. |
| `tests/test_frontend.py` | 7 | `GET /` serves HTML, static assets (`style.css`, `app.js`), form fields match schema, Theme Toggle at END of interface, Sun/Moon icons, theme CSS variables, JS persistence, responsive viewport. |
| **Total** | **18 / 18 Passed** | **100% Pass Rate** |

---

## ⚠️ Assumptions & Limitations

1. **Model Scope**: The model is trained exclusively on King County, WA transactions (King County zip codes 98001–98199). Predictions for coordinates outside King County will exhibit higher variance.
2. **Fixed Base Year**: In `homework1.ipynb`, `house_age` was computed using 2015 as the baseline year (`2015 - yr_built`). The backend preserves this exact calculation to remain 100% true to the training distribution.
3. **No Retraining at Runtime**: The API utilizes the pre-trained `kc_house_xgb_model.pkl` pipeline without in-flight retraining, ensuring deterministic, low-latency inference (<10ms).
