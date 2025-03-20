from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.settings import get_settings

from core.fastapi_logger import fastapi_logger
from api import forti_traffic

settings = get_settings()

fastapi_logger.setLevel(settings.LOGGING_LEVEL)


app = FastAPI(
    title=settings.app_title
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(forti_traffic.router, prefix="/forti_traffic")
