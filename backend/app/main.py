from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import feedback, user, database, challenge, score

app = FastAPI(title="Querizer Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", settings.app_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(database.router, prefix="/database", tags=["database"])
app.include_router(challenge.router, prefix="/challenge", tags=["challenge"])
app.include_router(score.router, prefix="/score", tags=["score"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])


@app.get("/status")
async def status_endpoint():
    return {"status": "ok"}
