import traceback
from tasks import crawl_worker

from utils.common import logging
from utils.common.connectors import Connector
from utils.crawler import SeleniumCrawler
from utils.crawler.parser.SeleniumParser import parseImage

logger = logging.getLogger(__name__)

@crawl_worker.task #(ignore_result=True)
def getImages(url=None):
  if url is None: raise Exception("url is None.")

  crawler = None

  try:
    crawler = SeleniumCrawler(timeout=10)
    result = crawler.run(url, parser=parseImage)
    
    if result is not None:    
      logger.info( "{} - count: {}".format(__name__, len(result)) )
      
  except Exception as e:
    logger.error( traceback.format_exc() )
  finally:
    if crawler is not None:
      crawler.close()
      