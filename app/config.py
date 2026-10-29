import os
from pathlib import Path

# Base project directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Model Configuration
MODEL_PATH = BASE_DIR / "kc_house_xgb_model.pkl"
DATA_PATH = BASE_DIR / "kc_house_data.csv"

# Server Configuration
APP_TITLE = "King County House Price Prediction API"
APP_DESCRIPTION = "Production ML inference service for King County residential real estate prices based on XGBoost regression."
APP_VERSION = "1.0.0"
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

# Base Year used for feature engineering (consistent with homework1.ipynb: 2015 - yr_built)
FEATURE_ENGINEERING_BASE_YEAR = 2015
