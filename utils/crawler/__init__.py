from utils.crawler.middleware import RequestMiddleware, SeleniumMiddleware

class Crawler(RequestMiddleware):
  pass

class SeleniumCrawler(SeleniumMiddleware):
  def __init__(self, *args, **kwargs):
    SeleniumMiddleware.__init__(self, *args, **kwargs)

  def run(self, url, callback=None):
    _callback = self.parser if callback is None else callback
    return self.get(url, callback=_callback)