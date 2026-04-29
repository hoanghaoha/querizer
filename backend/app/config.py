from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    anthropic_key: str = ""
    databases_path: str = "/tmp/databases"
    app_url: str = ""
    polar_webhook_secret: str = ""
    polar_access_token: str = ""
    polar_product_pro_id: str = ""
    polar_product_max_id: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
