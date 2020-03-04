import os
import requests

from bs4 import BeautifulSoup as bs

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from config import SELENIUM_DRIVER_PATH
from utils.common import logging

logger = logging.getLogger(__name__)

class Middleware(object):
  driver = None

  def __init__(self, *args, **kwargs):
    pass

  def get(self, url, callback=None):
    if callback is None:
      raise Exception("callback is None.")


class RequestMiddleware(Middleware):
  def __init__(self, *args, **kwargs):
    self.driver = requests

    Middleware.__init__(self, *args, **kwargs)

  def get(self, url, callback=None):
    if callback is None:
      raise Exception("callback is None.")

    try:
      response = self.driver.get(url)

      html = None
      if int(response.status_code/100) == 2:
        html = bs(response.text, "lxml")
      
      callback(response=html)

    except Exception as e:
      logger.error( e )

  def getPageSource(self):
    return self.driver.text

  def close(self):
    self.driver = None
  

class SeleniumMiddleware(Middleware):
  timeout = 0
  _options = ['--headless', '--no-sandbox', '--disable-gpu', '--disable-logging', '--log-level=3' ]

  def __init__(self, *args, **kwargs):
    if kwargs.get("timeout") is not None:
      self.timeout = int(kwargs.get("timeout"))

    options = Options()
    for opt in self._options:
      options.add_argument( opt )

    try:
      driver = webdriver.Chrome(
        executable_path=SELENIUM_DRIVER_PATH
        , options=options
        , service_log_path='/dev/null'
      )
      self.driver = driver

    except Exception as e:
      logger.error( e )

    Middleware.__init__(self, *args, **kwargs)

  def get(self, url, callback=None):
    if callback is None:
      raise Exception("callback is None.")

    result = None
    
    try:
      self.driver.get(url)

      result = callback(response=self.driver, timeout=self.timeout)
    except Exception as e:
      logger.error( e )
    finally:
      return result

  def parser(self, response=None, **kwargs):
    return None

  def getPageSource(self):
    return self.driver.page_source

  def close(self):
    if self.driver is not None:
      self.driver.quit()
    self.driver = None
