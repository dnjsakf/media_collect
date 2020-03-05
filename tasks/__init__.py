from celery import Celery
from config import CELERY_BROKER, CELERY_BACKEND

crawl_worker = Celery(
  'crawl_worker'
  , broker=CELERY_BROKER
  , backend=CELERY_BACKEND
  , include=[
      'tasks.crawl'
  ]
)

crawl_worker.conf.CELERYD_CONCURRENCY = 10
crawl_worker.conf.TASK_RESULT_EXPIRES = 3600