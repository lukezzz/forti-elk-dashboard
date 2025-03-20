from typing import Annotated, AsyncGenerator

from fastapi import Depends
from redis import asyncio as aioredis

from core.settings import cfg


def register_redis(redis_url):
    return aioredis.from_url(redis_url, decode_responses=True)


async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:
    rds = await register_redis(str(cfg.REDIS_URI))
    try:
        yield rds
    finally:
        await rds.close()


redisSession = Annotated[aioredis.Redis, Depends(get_redis)]
