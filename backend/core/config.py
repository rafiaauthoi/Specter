from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    FRONTEND_URL: str = "http://localhost:5173"
    DATABASE_URL: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"

    class Config:
        env_file = ".env"

settings = Settings()