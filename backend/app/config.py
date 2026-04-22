from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_key: str = ""
    anthropic_key: str = ""
    databases_path: str = ""
    app_url: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
