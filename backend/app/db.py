from supabase import create_client, Client
from app.config import settings

db: Client = create_client(settings.supabase_url, settings.supabase_key)
