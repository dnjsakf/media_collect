from utils.common import logging

from utils.common.connectors import Connector
from utils.crawler import Crawler, SeleniumCrawler
from utils.crawler.parser import SeleniumParser

#conn = Connector.connect('mongo')

logger = logging.getLogger(__name__)

def crawl_images(url=None):
  if url is None: raise Exception("url is None.")

  crawler = SeleniumCrawler(timeout=10)

  try:
    parser = SeleniumParser.imageParser
    result = crawler.run(url, callback=parser)
  except Exception as e:
    logger.error( e )
  finally:
    crawler.close()

  return result
    