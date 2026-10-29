import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {
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
    "long": -122.319,
    "sqft_living15": 1690,
    "sqft_lot15": 7639
}


def test_health_endpoint():
    """Verify GET /health returns status 200 and indicates model is loaded."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["model_type"] == "Pipeline"
    assert "version" in data


def test_predict_endpoint_valid_payload():
    """Verify POST /predict returns real prediction with status 200."""
    response = client.post("/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    
    assert "predicted_price" in data
    assert data["predicted_price"] > 0
    assert "formatted_price" in data
    assert data["currency"] == "USD"
    assert data["model_name"] == "XGBoost Regressor (Pipeline)"
    assert "input_summary" in data
    assert data["input_summary"]["bedrooms"] == 3
    assert data["input_summary"]["house_age"] == 64


def test_predict_endpoint_missing_feature():
    """Verify POST /predict returns 422 when required feature is omitted."""
    invalid_payload = VALID_PAYLOAD.copy()
    del invalid_payload["sqft_living"]
    
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


def test_predict_endpoint_invalid_type():
    """Verify POST /predict returns 422 when a non-numeric type is sent."""
    invalid_payload = VALID_PAYLOAD.copy()
    invalid_payload["bedrooms"] = "three_bedrooms"
    
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


def test_predict_endpoint_out_of_range_value():
    """Verify POST /predict returns 422 for values violating constraints."""
    # Grade can only be between 1 and 13
    invalid_payload = VALID_PAYLOAD.copy()
    invalid_payload["grade"] = 99
    
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422

    # Negative sqft_living
    invalid_payload2 = VALID_PAYLOAD.copy()
    invalid_payload2["sqft_living"] = -500
    response2 = client.post("/predict", json=invalid_payload2)
    assert response2.status_code == 422


def test_predict_endpoint_waterfront_luxury():
    """Verify prediction responds correctly to high-end waterfront properties."""
    luxury_payload = VALID_PAYLOAD.copy()
    luxury_payload.update({
        "waterfront": 1,
        "view": 4,
        "grade": 11,
        "sqft_living": 5000,
        "sqft_above": 4000,
        "sqft_basement": 1000,
        "bathrooms": 4.5,
        "bedrooms": 5
    })
    response = client.post("/predict", json=luxury_payload)
    assert response.status_code == 200
    data = response.json()
    # High-end waterfront home should be evaluated significantly higher
    assert data["predicted_price"] > 1_000_000


def test_cors_headers():
    """Verify CORS headers are returned for cross-origin requests."""
    response = client.options("/predict", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
