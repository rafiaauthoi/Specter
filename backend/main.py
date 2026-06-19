from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from core.config import settings
from routers import auth
from routers import google

app = FastAPI(title="Clearprint API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(google.router, prefix="/google", tags=["google"])

@app.get("/health")
def health():
    return {"status": "ok"}