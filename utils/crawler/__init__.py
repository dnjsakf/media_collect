from utils.crawler.middleware import RequestMiddleware, SeleniumMiddleware

class Crawler(RequestMiddleware):
  pass
  

class SeleniumCrawler(SeleniumMiddleware):
  def __init__(self, *args, **kwargs):
    SeleniumMiddleware.__init__(self, *args, **kwargs)

  def run(self, url, parser=None):
    _parser = self.__parser if parser is None else parser
    return self.get(url, parser=_parser)
    
  @property
  def parser(self):
    return self.__parser
 
  @parser.setter
  def parser(self, value):
      self.__parser = value