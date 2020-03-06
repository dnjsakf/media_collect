import traceback
import uuid
import datetime

from utils.crawler import SeleniumCrawler
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def pasreCoupangProductList(response, **kwargs):
  timeout = 0
  if kwargs.get("timeout") is not None:
    timeout = int(kwargs.get("timeout") )
  
  product_list = WebDriverWait(response, timeout).until(
    EC.presence_of_all_elements_located((By.XPATH, '//ul[@id="productList"]/li/a'))
  )

  items = list()
  for idx, product in enumerate(product_list):
    try:
      item = dict()
      item["shop"] = "coupang"
      item["id"] = str(uuid.uuid4())
      item["link"] = product.get_attribute("href")
      item["image"] = product.find_element_by_xpath("dl/dt/img").get_attribute("src")
      item["name"] = product.find_element_by_xpath("dl/dd/div/div[2]").text
      item["price"] = product.find_element_by_xpath("dl/dd/div/div[3]/div/div[1]/em/strong").text.replace(",", "")
      item["checked"] = 0
      item["load_dttm"] = datetime.datetime.now().strftime("%Y%m%d%H%M%s")

      items.append( item )
    except Exception as e:
      pass

  return items