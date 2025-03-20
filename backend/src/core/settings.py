import os
from typing import  Optional
from functools import lru_cache
from pydantic import RedisDsn
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: Optional[str] = "dev"
    SECRET_KEY: Optional[str] = "dev"
    FERNET_KEY: Optional[str] = "dev"
    ORIGINS: Optional[str] = "*"
    OTELE_TRACE: Optional[bool] = False
    LOGGING_LEVEL: Optional[str] = "DEBUG"


    REDIS_URI: Optional[RedisDsn] = None

    app_title: Optional[str] = "backend"

    ELK_HOST: Optional[str] = None
    ELK_USERNAME: Optional[str] = None
    ELK_PASSWORD: Optional[str] = None
    ELK_API_KEY: Optional[str] = None

    ELK_INDEX: Optional[str] = "logs-fortinet_fortigate.log-default"

    # KIBANA_URL: str
    # KIBANA_USERNAME: str
    # KIBANA_PASSWORD: str

    BASEDIR: str = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )

    # model_config = SettingsConfigDict(
    #     env_file="../.env", extra="allow", env_nested_delimiter="__"
    # )


# we are using the @lru_cache() decorator on top,
# the Settings object will be created only once, the first time it's called.
@lru_cache
def get_settings():
    return Settings()


cfg: Settings = Settings()
