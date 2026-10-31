from fastapi import FastAPI
from app.database import engine, Base
from app import models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bulk Certificate Generator",
    description="API for generating certificates in bulk",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Bulk Certificate Generator API!",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }