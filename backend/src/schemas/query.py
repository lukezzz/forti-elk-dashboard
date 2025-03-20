from pydantic import BaseModel
from typing import Optional
import datetime


class QueryFields(BaseModel):
    query_type: Optional[str] = None
    start_time: Optional[datetime.datetime] = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=15)
    end_time: Optional[datetime.datetime] = datetime.datetime.now(datetime.timezone.utc)
    top_n: Optional[int] = 10
    interval: Optional[str] = "1 hour"

    def formatted_start_time(self):
        return self.start_time.isoformat()

    def formatted_end_time(self):
        return self.end_time.isoformat()