from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query

from core.custom_api_route import HandleResponseRoute
from core.dependencies.elastic import es_client
from core.settings import cfg
from schemas.query import QueryFields

router = APIRouter(
    route_class=HandleResponseRoute,
    tags=["forti_traffic"],
    responses={404: {"detail": "Not found"}},
)



# get requests over time
@router.get(
    "/requests_over_time",
)
def requests_over_time(
    es: es_client = Depends(),
    query_fields: QueryFields = Depends(),
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
                              "gte": "{query_fields.formatted_start_time()}",
                              "lte": "{query_fields.formatted_end_time()}"
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
    query_fields: QueryFields = Depends(),
):
    query = f"""
    {{
      "aggs": {{
          "0": {{
              "date_histogram": {{
                  "field": "@timestamp",
                  "fixed_interval": "1h",
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
                              "gte": "{query_fields.formatted_start_time()}",
                              "lte": "{query_fields.formatted_end_time()}"
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
    query_fields: QueryFields = Depends(),
):
    query = f"""
      {{
        "aggs": {{
            "0": {{
                "terms": {{
                    "field": "event.action",
                    "order": {
                        "_count": "desc"
                    },
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
                                "gte": "{query_fields.formatted_start_time()}",
                                "lte": "{query_fields.formatted_end_time()}"
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
    
  

@router.get(
    "/country_count",
)
def country_count(
    es: es_client = Depends(),
    query_fields: QueryFields = Depends(),
):
    if query_fields.query_type == "source":
        field = "source.geo.country_name"
    elif query_fields.query_type == "destination":
        field = "destination.geo.country_name"
    else:
        raise HTTPException(status_code=400, detail="Invalid query_type. Must be 'source' or 'destination'.")

    query = f"""
    {{
      "aggs": {{
          "0": {{
              "terms": {{
                  "field": "{field}",
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
                              "gte": "{query_fields.formatted_start_time()}",
                              "lte": "{query_fields.formatted_end_time()}"
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
        dataset = {
            "dimensions": ["country", "count"],
            "source": [{"country": b["key"], "count": b["doc_count"]} for b in buckets]
        }
        return dataset
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))





@router.get(
    "/ip_count",
)
def ip_count(
    es: es_client = Depends(),
    query_fields: QueryFields = Depends(),
):
    if query_fields.query_type == "source":
        field = "source.ip"
    elif query_fields.query_type == "destination":
        field = "destination.ip"
    else:
        raise HTTPException(status_code=400, detail="Invalid query_type. Must be 'source' or 'destination'.")

    query = f"""
    {{
      "aggs": {{
          "0": {{
              "terms": {{
                  "field": "{field}",
                  "order": {{
                      "_count": "desc"
                  }},
                  "size": 10,
                  "shard_size": 25
              }}
          }}
      }},
      "size": 0,
      "_source": {{
          "excludes": []
      }},
      "query": {{
          "bool": {{
              "must": [],
              "filter": [
                  {{
                      "range": {{
                          "@timestamp": {{
                              "format": "strict_date_optional_time",
                              "gte": "{query_fields.formatted_start_time()}",
                              "lte": "{query_fields.formatted_end_time()}"
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
        dataset = {
            "dimensions": ["ip", "count"],
            "source": [{"ip": b["key"], "count": b["doc_count"]} for b in buckets]
        }
        return dataset
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))




@router.get(
    "/event_action_count",
)
def event_action_count(
    es: es_client = Depends(),
    query_fields: QueryFields = Depends(),
):
    query = f"""
    {{
      "aggs": {{
            "0": {{
            "terms": {{
                "field": "fortinet.firewall.action",
                "order": {{
                    "_count": "desc"
                }},
                "size": 10,
                "shard_size": 25
            }},
            "aggs": {{
                "1": {{
                    "date_histogram": {{
                        "field": "@timestamp",
                        "fixed_interval": "1h"
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
                              "gte": "{query_fields.formatted_start_time()}",
                              "lte": "{query_fields.formatted_end_time()}"
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
        

        return {
            "data": [
                {
                    "action": b["key"],
                    "count": [t["doc_count"] for t in b["1"]["buckets"]]
                } for b in buckets
            ],
            "time": [t["key_as_string"] for t in buckets[0]["1"]["buckets"]]
        }
       
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    

# Connections
@router.get(
    "/connections",
)
def connections(
    es: es_client = Depends(),
    query_fields: QueryFields = Depends(),
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
            "size": 10
          }},
          "aggs": {{
            "sourceGrid": {{
              "geotile_grid": {{
                "field": "source.geo.location",
                "precision": 3,
                "size": 50
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
                    "gte": "{query_fields.formatted_start_time()}",
                    "lte": "{query_fields.formatted_end_time()}"
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
      }},
      "stored_fields": ["*"]
    }}
    """
    try:
        res = es.search(index=cfg.ELK_INDEX, body=query)
        buckets = res["aggregations"]["destSplit"]["buckets"]
        result = []
        for b in buckets:
            sourceGrid = b["sourceGrid"]["buckets"]
            result.append({
                "dest": b["key"],
                "source": [
                    {
                        "lat": s["sourceCentroid"]["location"]["lat"],
                        "lon": s["sourceCentroid"]["location"]["lon"],
                        "count": s["doc_count"]
                    } for s in sourceGrid
                ]
            })
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))