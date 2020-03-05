# media_collect


# Run Celery
celery worker -A tasks:crawl_worker --concurrency=10 --pool=gevent --loglevel=INFO

# Run Celery Daemon
celery worker -A tasks:crawl_worker --concurrency=10 --pool=gevent --loglevel=INFO -D