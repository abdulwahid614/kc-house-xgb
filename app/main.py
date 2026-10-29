import logging
import mimetypes
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import APP_TITLE, APP_DESCRIPTION, APP_VERSION, HOST, PORT
from app.model import model_service
from app.schemas import HouseFeatures, PredictionResponse, HealthResponse, ErrorResponse

# Explicitly ensure correct mime types on all operating systems
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("kc_house_api")

STATIC_DIR = Path(__file__).resolve().parent / "static"

# Pre-load model on module initialization so it is immediately accessible
try:
    model_service.load_model()
    logger.info("ML model pre-loaded successfully.")
except Exception as e:
    logger.warning(f"Initial model preload skipped or deferred: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown events."""
    logger.info("Initializing API application lifecycle...")
    if not model_service.is_loaded:
        try:
            model_service.load_model()
            logger.info("Model loaded successfully during startup event.")
        except Exception as e:
            logger.warning(f"Could not load model during startup event: {e}")
    yield
    logger.info("Application shutting down.")


app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local development and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static assets
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/", include_in_schema=False)
async def serve_index():
    """Serves the main frontend Single Page Application."""
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse(
        content={
            "message": "Welcome to King County House Price Prediction API",
            "docs": "/docs",
            "health": "/health",
            "predict": "/predict (POST)"
        }
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health and Readiness Check",
    description="Check whether the API service is operational and if the ML model is loaded."
)
async def health_check():
    loaded = model_service.is_loaded
    return HealthResponse(
        status="healthy" if loaded else "degraded",
        model_loaded=loaded,
        model_type=model_service.get_model_type(),
        version=APP_VERSION
    )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        422: {"model": ErrorResponse, "description": "Validation Error: Missing or invalid features"},
        500: {"model": ErrorResponse, "description": "Internal Server Error during inference"},
        503: {"model": ErrorResponse, "description": "Model Unavailable"}
    },
    tags=["Predictions"],
    summary="Predict House Price",
    description="Accepts residential property features, validates and formats inputs, and runs inference through the trained King County XGBoost pipeline."
)
async def predict_price(features: HouseFeatures):
    if not model_service.is_loaded:
        try:
            model_service.load_model()
        except Exception as e:
            logger.error(f"Model unavailable: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Prediction model is unavailable: {str(e)}"
            )

    try:
        prediction = model_service.predict(features)
        return prediction
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=5002, reload=True)
