from utils.common import logging
from tasks import crawl

logger = logging.getLogger(__file__)

result = crawl.crawl_images("https://www.google.com")
logger.info( result )