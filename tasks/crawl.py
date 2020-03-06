import traceback
from tasks import crawl_worker

from utils.common import logging
from utils.crawler import SeleniumCrawler

from utils.crawler.parser.ShopProductParser import pasreCoupangProductList
from utils.pipelines.shop import product


logger = logging.getLogger(__name__)

@crawl_worker.task(ignore_result=True)
def getMaskProductList(shop_name, url=None):
  if shop_name == "coupang":
    options=[ 
      "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
    ]
    crawler = SeleniumCrawler(timeout=10, chrome_options=options)

    product_list = crawler.run(url, parser=pasreCoupangProductList)
    
    result = product.mergeProductList( product_list )

    crawler.close()