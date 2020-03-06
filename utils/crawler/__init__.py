from utils.crawler.middleware import RequestMiddleware, SeleniumMiddleware

class Crawler(RequestMiddleware):
  pass
  

class SeleniumCrawler(SeleniumMiddleware):
  def __init__(self, *args, **kwargs):
    SeleniumMiddleware.__init__(self, *args, **kwargs)

  def run(self, url, parser=None):
    return self.get(url, parser=parser)