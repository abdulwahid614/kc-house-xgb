from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class HouseFeatures(BaseModel):
    bedrooms: int = Field(
        ...,
        ge=0,
        le=33,
        description="Number of bedrooms in the property",
        json_schema_extra={"example": 3}
    )
    bathrooms: float = Field(
        ...,
        ge=0.0,
        le=12.0,
        description="Number of bathrooms (e.g. 1.0, 2.25, 2.5)",
        json_schema_extra={"example": 2.25}
    )
    sqft_living: int = Field(
        ...,
        ge=200,
        le=20000,
        description="Square footage of interior living space",
        json_schema_extra={"example": 2570}
    )
    sqft_lot: int = Field(
        ...,
        ge=300,
        le=2000000,
        description="Square footage of land space / lot",
        json_schema_extra={"example": 7242}
    )
    floors: float = Field(
        ...,
        ge=1.0,
        le=4.0,
        description="Number of floors / levels in the house",
        json_schema_extra={"example": 2.0}
    )
    waterfront: int = Field(
        0,
        ge=0,
        le=1,
        description="Whether the property has a direct waterfront view (0 = No, 1 = Yes)",
        json_schema_extra={"example": 0}
    )
    view: int = Field(
        0,
        ge=0,
        le=4,
        description="Index from 0 to 4 of how good the view of the property was",
        json_schema_extra={"example": 0}
    )
    condition: int = Field(
        3,
        ge=1,
        le=5,
        description="Condition index of the house from 1 (poor) to 5 (excellent)",
        json_schema_extra={"example": 3}
    )
    grade: int = Field(
        7,
        ge=1,
        le=13,
        description="King County grading index of construction quality and design (1-13)",
        json_schema_extra={"example": 7}
    )
    sqft_above: int = Field(
        ...,
        ge=200,
        le=15000,
        description="Square footage of interior housing space above ground level",
        json_schema_extra={"example": 2170}
    )
    sqft_basement: int = Field(
        0,
        ge=0,
        le=10000,
        description="Square footage of interior housing space below ground level",
        json_schema_extra={"example": 400}
    )
    yr_built: int = Field(
        ...,
        ge=1900,
        le=2026,
        description="Year the house was initially built",
        json_schema_extra={"example": 1951}
    )
    yr_renovated: int = Field(
        0,
        ge=0,
        le=2026,
        description="Year of last renovation (0 if never renovated)",
        json_schema_extra={"example": 1991}
    )
    zipcode: int = Field(
        ...,
        ge=98000,
        le=98999,
        description="5-digit Washington King County ZIP code",
        json_schema_extra={"example": 98125}
    )
    lat: float = Field(
        ...,
        ge=47.0,
        le=48.0,
        description="Latitude coordinate in King County",
        json_schema_extra={"example": 47.7210}
    )
    long: float = Field(
        ...,
        ge=-123.0,
        le=-121.0,
        description="Longitude coordinate in King County",
        json_schema_extra={"example": -122.319}
    )
    sqft_living15: int = Field(
        ...,
        ge=200,
        le=10000,
        description="Average living space square footage for the nearest 15 neighbors",
        json_schema_extra={"example": 1690}
    )
    sqft_lot15: int = Field(
        ...,
        ge=300,
        le=1000000,
        description="Average lot land space square footage for the nearest 15 neighbors",
        json_schema_extra={"example": 7639}
    )
    house_age: Optional[int] = Field(
        None,
        description="Age of house relative to base year 2015 (computed automatically if omitted)",
        json_schema_extra={"example": 64}
    )
    total_rooms_count: Optional[float] = Field(
        None,
        description="Total combined count of bedrooms and bathrooms (computed automatically if omitted)",
        json_schema_extra={"example": 5.25}
    )

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Estimated house price in USD")
    formatted_price: str = Field(..., description="Formatted currency string")
    currency: str = Field("USD", description="Currency denomination")
    model_name: str = Field("XGBoost Regressor (Pipeline)", description="Model used for inference")
    input_summary: Dict[str, Any] = Field(..., description="Key input features and derived metrics")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status ('healthy' or 'degraded')")
    model_loaded: bool = Field(..., description="Whether the ML model is loaded and ready")
    model_type: Optional[str] = Field(None, description="Class name of loaded model")
    version: str = Field(..., description="API Version")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Human-readable error description")
    error_code: Optional[str] = Field(None, description="System error code")
