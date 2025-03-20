from elasticsearch import Elasticsearch
from core.settings import cfg
import warnings
from elasticsearch.exceptions import ElasticsearchWarning

def get_elasticsearch():
    
    es = Elasticsearch(
        hosts=cfg.ELK_HOST.split(","),
        http_auth=(cfg.ELK_USERNAME, cfg.ELK_PASSWORD),
        verify_certs=False,
        ssl_show_warn=False,
    )
    return es

def es_client():
    with get_elasticsearch() as es:
        try:
            warnings.simplefilter('ignore', category=ElasticsearchWarning)
            yield es
        finally:
            es.close()