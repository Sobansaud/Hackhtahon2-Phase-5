from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    PROJECT_NAME: str = "Todo API"
    BETTER_AUTH_SECRET: str = "dev-secret"
    BETTER_AUTH_URL: str = "http://localhost:3000"
    DATABASE_URL: str
    COHERE_API_KEY: str | None = None

settings = Settings()