import logging
from typing import Optional, Dict, Any
import joblib
import pandas as pd
import numpy as np

from app.config import MODEL_PATH, FEATURE_ENGINEERING_BASE_YEAR
from app.schemas import HouseFeatures, PredictionResponse

logger = logging.getLogger(__name__)

# Exact feature ordering expected by the trained XGBoost model pipeline
MODEL_FEATURE_NAMES = [
    'bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'floors', 'waterfront',
    'view', 'condition', 'grade', 'sqft_above', 'sqft_basement', 'yr_built',
    'yr_renovated', 'zipcode', 'lat', 'long', 'sqft_living15', 'sqft_lot15',
    'house_age', 'total_rooms_count'
]


class ModelService:
    def __init__(self, model_path=MODEL_PATH):
        self.model_path = model_path
        self._model = None

    def load_model(self) -> None:
        """Loads the serialized model pipeline from disk."""
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model file not found at: {self.model_path}")
        
        try:
            logger.info(f"Loading ML model from {self.model_path}...")
            self._model = joblib.load(self.model_path)
            logger.info("ML model successfully loaded and ready for inference.")
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
            raise RuntimeError(f"Error loading model from {self.model_path}: {e}")

    @property
    def is_loaded(self) -> bool:
        """Returns True if the model is loaded in memory."""
        return self._model is not None

    def get_model_type(self) -> Optional[str]:
        """Returns the class representation of the loaded model."""
        if self._model is not None:
            return type(self._model).__name__
        return None

    def prepare_dataframe(self, features: HouseFeatures) -> pd.DataFrame:
        """
        Converts HouseFeatures schema to pandas DataFrame with the exact
        feature set, names, and derived variables used in training.
        """
        # Calculate derived features if not explicitly provided
        house_age = (
            features.house_age 
            if features.house_age is not None 
            else (FEATURE_ENGINEERING_BASE_YEAR - features.yr_built)
        )
        total_rooms_count = (
            features.total_rooms_count 
            if features.total_rooms_count is not None 
            else (float(features.bedrooms) + float(features.bathrooms))
        )

        data: Dict[str, Any] = {
            'bedrooms': [features.bedrooms],
            'bathrooms': [features.bathrooms],
            'sqft_living': [features.sqft_living],
            'sqft_lot': [features.sqft_lot],
            'floors': [features.floors],
            'waterfront': [features.waterfront],
            'view': [features.view],
            'condition': [features.condition],
            'grade': [features.grade],
            'sqft_above': [features.sqft_above],
            'sqft_basement': [features.sqft_basement],
            'yr_built': [features.yr_built],
            'yr_renovated': [features.yr_renovated],
            'zipcode': [features.zipcode],
            'lat': [features.lat],
            'long': [features.long],
            'sqft_living15': [features.sqft_living15],
            'sqft_lot15': [features.sqft_lot15],
            'house_age': [house_age],
            'total_rooms_count': [total_rooms_count]
        }

        # Build dataframe preserving the exact column sequence
        df = pd.DataFrame(data)[MODEL_FEATURE_NAMES]
        return df

    def predict(self, features: HouseFeatures) -> PredictionResponse:
        """
        Performs real inference on incoming features using the loaded model.
        """
        if not self.is_loaded:
            self.load_model()

        df = self.prepare_dataframe(features)
        
        try:
            raw_prediction = self._model.predict(df)
            predicted_value = float(raw_prediction[0])
            
            # Floor at 0 if needed (house prices cannot be negative)
            clean_price = round(max(0.0, predicted_value), 2)
            formatted = f"${clean_price:,.2f}"

            house_age = int(df['house_age'].iloc[0])
            total_rooms = float(df['total_rooms_count'].iloc[0])

            summary = {
                "bedrooms": features.bedrooms,
                "bathrooms": features.bathrooms,
                "sqft_living": features.sqft_living,
                "grade": features.grade,
                "condition": features.condition,
                "waterfront": bool(features.waterfront),
                "zipcode": features.zipcode,
                "yr_built": features.yr_built,
                "house_age": house_age,
                "total_rooms_count": total_rooms
            }

            return PredictionResponse(
                predicted_price=clean_price,
                formatted_price=formatted,
                currency="USD",
                model_name="XGBoost Regressor (Pipeline)",
                input_summary=summary
            )
        except Exception as e:
            logger.error(f"Inference error during model prediction: {e}")
            raise RuntimeError(f"Model prediction failed: {e}")


# Singleton instance
model_service = ModelService()
