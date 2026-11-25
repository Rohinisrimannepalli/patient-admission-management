
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models
from routes.patients import router as patient_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield
    engine.dispose()


app = FastAPI(
    title="Patient Admission Management API",
    description="API for managing hospital patient admissions",
    version="1.0.0",
    lifespan=lifespan
)


# Allowed frontend URLs
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    origins.append(frontend_url.rstrip("/"))


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register patient routes
app.include_router(patient_router)


@app.get("/")
def home():
    return {
        "message": "Patient Admission Management API is running!"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
