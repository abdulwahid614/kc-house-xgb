import pytest
from pathlib import Path
from app.config import MODEL_PATH, FEATURE_ENGINEERING_BASE_YEAR
from app.model import ModelService, MODEL_FEATURE_NAMES
from app.schemas import HouseFeatures


@pytest.fixture
def model_service():
    service = ModelService(model_path=MODEL_PATH)
    service.load_model()
    return service


@pytest.fixture
def sample_house_features():
    return HouseFeatures(
        bedrooms=3,
        bathrooms=2.25,
        sqft_living=2570,
        sqft_lot=7242,
        floors=2.0,
        waterfront=0,
        view=0,
        condition=3,
        grade=7,
        sqft_above=2170,
        sqft_basement=400,
        yr_built=1951,
        yr_renovated=1991,
        zipcode=98125,
        lat=47.7210,
        long=-122.319,
        sqft_living15=1690,
        sqft_lot15=7639
    )


def test_model_file_exists():
    """Verify that the serialized model file exists on disk."""
    assert MODEL_PATH.exists(), f"Model file missing at: {MODEL_PATH}"
    assert MODEL_PATH.stat().st_size > 0, "Model file is empty"


def test_model_loading(model_service):
    """Verify that model loads properly into memory."""
    assert model_service.is_loaded is True
    assert model_service.get_model_type() == "Pipeline"


def test_dataframe_preparation(model_service, sample_house_features):
    """Verify DataFrame structure, column sequence, and derived calculations."""
    df = model_service.prepare_dataframe(sample_house_features)
    
    # Check exact column count and sequence
    assert list(df.columns) == MODEL_FEATURE_NAMES
    assert len(df.columns) == 20
    
    # Check derived features
    expected_age = FEATURE_ENGINEERING_BASE_YEAR - sample_house_features.yr_built  # 2015 - 1951 = 64
    expected_rooms = sample_house_features.bedrooms + sample_house_features.bathrooms  # 3 + 2.25 = 5.25
    
    assert df['house_age'].iloc[0] == expected_age
    assert df['total_rooms_count'].iloc[0] == expected_rooms


def test_real_prediction_inference(model_service, sample_house_features):
    """Verify that real model inference executes and returns positive valuation."""
    response = model_service.predict(sample_house_features)
    
    assert response is not None
    assert response.predicted_price > 0.0
    assert isinstance(response.predicted_price, float)
    assert response.currency == "USD"
    assert "$" in response.formatted_price
    assert response.model_name == "XGBoost Regressor (Pipeline)"
    assert response.input_summary["grade"] == 7
    assert response.input_summary["house_age"] == 64
    assert response.input_summary["total_rooms_count"] == 5.25
