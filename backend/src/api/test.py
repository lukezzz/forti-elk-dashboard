from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query

from core.custom_api_route import HandleResponseRoute
from core.dependencies.elastic import es_client
from core.settings import cfg
from pydantic import BaseModel, ConfigDict, Field, field_validator, AliasChoices
from typing import Optional, Union
import datetime


router = APIRouter(
    route_class=HandleResponseRoute,
    tags=["test"],
    responses={404: {"detail": "Not found"}},
)




class QueryFields(BaseModel):
    query_type: Optional[str] = None
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
    top_n: Optional[int] = 10
    interval: Optional[str] = "1 hour"

def write_log(message=""):
    with open("log.txt", mode="w") as email_file:
        content = f"{message}"
        email_file.write(content)


@router.get(
    "/index",
    summary="get index",
)
def get_index(
    background_tasks: BackgroundTasks,
    es: es_client = Depends(),
):
    try:
        index = es.indices.get_alias(index="")
        background_tasks.add_task(write_log, message=index)
        return index
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# get index details
@router.get(
    "/index/{index_name}",
    summary="get index details",
)
def get_index_details(
    index_name: str,
    es: es_client = Depends(),
):
    try:
        index = es.indices.get(index=index_name)
        return index
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# get traffic data with geo
@router.get(
    "/traffic",
    summary="get traffic data with geo",
)
def get_traffic_data(
    es: es_client = Depends(),
    start: str = Query(None),
    end: str = Query(None),
):
    query = f"""
    {{
      "size": 0,
      "aggs": {{
        "destSplit": {{
          "terms": {{
            "script": {{
              "source": "doc['destination.geo.location'].value.toString()",
              "lang": "painless"
            }},
            "order": {{
              "_count": "desc"
            }},
            "size": 100
          }},
          "aggs": {{
            "sourceGrid": {{
              "geotile_grid": {{
                "field": "source.geo.location",
                "precision": 3,
                "size": 500
              }},
              "aggs": {{
                "sourceCentroid": {{
                  "geo_centroid": {{
                    "field": "source.geo.location"
                  }}
                }}
              }}
            }}
          }}
        }}
      }},
      "query": {{
        "bool": {{
          "filter": [
            {{
              "bool": {{
                "must": [
                  {{
                    "exists": {{
                      "field": "destination.geo.location"
                    }}
                  }},
                  {{
                    "geo_bounding_box": {{
                      "destination.geo.location": {{
                        "top_left": [-180, 89],
                        "bottom_right": [180, -89]
                      }}
                    }}
                  }}
                ]
              }}
            }},
            {{
              "range": {{
                "@timestamp": {{
                  "format": "strict_date_optional_time",
                  "gte": "{start or '2025-02-26T03:31:05.638Z'}",
                  "lte": "{end or '2025-02-26T03:46:05.638Z'}"
                }}
              }}
            }},
            {{
              "exists": {{
                "field": "source.geo.location"
              }}
            }}
          ]
        }}
      }}
    }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["destSplit"]["buckets"]
        result = {"data": [{"key": b["key"], "count": b["doc_count"]} for b in buckets]}
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# get requests over time
@router.get(
    "/requests_over_time",
)
def requests_over_time(
    es: es_client = Depends(),
    start: str = Query(None),
    end: str = Query(None)
):
    query = f"""
    {{
      "aggs": {{
          "0": {{
              "date_histogram": {{
                  "field": "@timestamp",
                  "fixed_interval": "12h",
                  "time_zone": "Asia/Shanghai"
              }}
          }}
      }},
      "size": 0,
      "query": {{
          "bool": {{
              "filter": [
                  {{
                      "range": {{
                          "@timestamp": {{
                              "format": "strict_date_optional_time",
                              "gte": "{start or '2025-02-12T02:21:17.421Z'}",
                              "lte": "{end or '2025-03-13T02:21:31.116Z'}"
                          }}
                      }}
                  }}
              ]
            }}
        }}
    }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["0"]["buckets"]
        result = {
          "time": [b["key_as_string"] for b in buckets],
          "count": [b["doc_count"] for b in buckets]
        }
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Network Bytes over Time
@router.get(
    "/network_bytes_over_time",
)
def network_bytes_over_time(
    es: es_client = Depends(),
    start: str = Query(None),
    end: str = Query(None)
):
    query = f"""
    {{
      "aggs": {{
          "0": {{
              "date_histogram": {{
                  "field": "@timestamp",
                  "fixed_interval": "12h",
                  "time_zone": "Asia/Shanghai"
              }},
              "aggs": {{
                  "1": {{
                      "percentiles": {{
                          "field": "network.bytes",
                          "percents": [50]
                      }}
                  }}
              }}
          }}
      }},
      "size": 0,
      "query": {{
          "bool": {{
              "filter": [
                  {{
                      "range": {{
                          "@timestamp": {{
                              "format": "strict_date_optional_time",
                              "gte": "{start or '2025-02-12T02:21:17.421Z'}",
                              "lte": "{end or '2025-03-13T02:21:31.116Z'}"
                          }}
                      }}
                  }}
              ]
          }}
      }}
    }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["0"]["buckets"]
        result = {
          "time": [b["key_as_string"] for b in buckets],
          "network_bytes_p50": [b["1"]["values"]["50.0"] for b in buckets]
        }
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
# get event action
@router.get(
    "/event_action",
)
def event_action(
    es: es_client = Depends(),
    start: str = Query(None),
    end: str = Query(None)
):
    query = f"""
      {{
        "aggs": {{
            "0": {{
                "terms": {{
                    "field": "event.action",
                    "order": {{
                        "_count": "desc"
                    }},
                    "size": 10,
                    "shard_size": 25
                }}
            }}
        }},
        "size": 0,
        "query": {{
            "bool": {{
                "filter": [
                    {{
                        "range": {{
                            "@timestamp": {{
                                "format": "strict_date_optional_time",
                                "gte": "{start or '2025-03-18T03:00:00.000Z'}",
                                "lte": "{end or '2025-03-19T03:25:13.512Z'}"
                            }}
                        }}
                    }}
                ]
            }}
        }}
      }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["0"]["buckets"]
        result = [{"action": b["key"], "count": b["doc_count"]} for b in buckets]
        return {"data": result}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
  

# source country count
@router.get(
    "/source_country_count",
)
def source_country_count(
    es: es_client = Depends(),
    start: str = Query(None),
    end: str = Query(None)
):
    query = f"""
    {{
      "aggs": {{
          "0": {{
              "terms": {{
                  "field": "source.geo.country_name",
                  "order": {{
                      "_count": "desc"
                  }},
                  "size": 10,
                  "shard_size": 25
              }}
          }}
      }},
      "size": 0,
      "query": {{
          "bool": {{
              "filter": [
                  {{
                      "range": {{
                          "@timestamp": {{
                              "format": "strict_date_optional_time",
                              "gte": "{start or '2025-03-18T03:00:00.000Z'}",
                              "lte": "{end or '2025-03-19T03:28:38.860Z'}"
                          }}
                      }}
                  }}
              ]
          }}
      }}
    }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["0"]["buckets"]
        result = [{"country": b["key"], "count": b["doc_count"]} for b in buckets]
        return {"data": result}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# get destination country count
@router.get(
    "/destination_country",
)
def destination_country(
    es: es_client = Depends(),
    start: str = Query(None),
    end: str = Query(None)
):
    query = f"""
    {{
      "aggs": {{
          "0": {{
              "terms": {{
                  "field": "destination.geo.country_name",
                  "order": {{
                      "_count": "desc"
                  }},
                  "size": 10,
                  "shard_size": 25
              }}
          }}
      }},
      "size": 0,
      "query": {{
          "bool": {{
              "filter": [
                  {{
                      "range": {{
                          "@timestamp": {{
                              "format": "strict_date_optional_time",
                              "gte": "{start or '2025-03-18T03:00:00.000Z'}",
                              "lte": "{end or '2025-03-19T03:28:38.860Z'}"
                          }}
                      }}
                  }}
              ]
          }}
      }}
    }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["0"]["buckets"]
        result = [{"country": b["key"], "count": b["doc_count"]} for b in buckets]
        return {"data": result}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))




