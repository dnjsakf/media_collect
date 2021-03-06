import os
import requests
import traceback

from bs4 import BeautifulSoup as bs

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from config import SELENIUM_DRIVER_PATH, SYSTEM_OS
from utils.common import logging


class Middleware(object):
  driver = None

  def __init__(self, *args, **kwargs):
    self.logger = logging.getLogger(self.__class__.__name__)
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
      self.logger.error( e )

  def getPageSource(self):
    return self.driver.text

  def close(self):
    self.driver = None


class SeleniumMiddleware(Middleware):
  timeout = 0
  _options = [ '--headless', '--no-sandbox', '--disable-gpu', '--disable-logging', '--log-level=3' ]

  def __init__(self, *args, **kwargs):
    if kwargs.get("timeout") is not None:
      self.timeout = int(kwargs.get("timeout"))

    if kwargs.get("chrome_options") is not None:
      self._options.extend(kwargs.get("chrome_options"))

    # Setting Chrome WebDriver Options
    chrome_options = Options()
    for opt in self._options:
      chrome_options.add_argument( opt )
      
    executable_path=SELENIUM_DRIVER_PATH
    service_log_path = "/dev/null"
    if SYSTEM_OS == "Windows":
      filename, extension = os.path.splitext(executable_path)
      if extension == "":
        executable_path += ".exe"
        
      # Disable the message 'DevTools listening on ~'
      chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
    
      service_log_path = "NUL"

    try:
      self.driver = webdriver.Chrome(
        executable_path=SELENIUM_DRIVER_PATH
        , chrome_options=chrome_options
        , service_log_path=service_log_path
      )
    except Exception as e:
      raise e

    Middleware.__init__(self, *args, **kwargs)

  def get(self, url, parser=None):
    if parser is None:
      raise Exception("parser is None.")

    result = None
    
    try:
      self.driver.get(url)

      kwargs = { "timeout": self.timeout }

      return parser(self.driver, **kwargs)
    except Exception as e:
      self.logger.error( traceback.format_exc() )
      return None

  def getPageSource(self):
    return self.driver.page_source

  def close(self):
    if self.driver is not None:
      self.driver.quit()
    self.driver = None
