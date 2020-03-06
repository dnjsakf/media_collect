from functools import wraps

from pymongo.cursor import Cursor
from pymongo.command_cursor import CommandCursor
      
from utils.common import logging
from utils.common.connectors import Connector

logger = logging.getLogger("{}.{}".format(__name__, "MongoDbDecorator"))

class MongoDbDecorator(object):
  @classmethod
  def connect(cls, database=None, document=None):
    def decorator(func):
      @wraps(func)
      def wrapper(*args, **kwargs):
        return func(Connector.connect("mongo")[database][document], *args, **kwargs)
      return wrapper
    return decorator

  @classmethod
  def select(cls, func):
    @wraps(func)
    def wrapper(*args, **kwargs):
      items = func(*args, **kwargs)

      if( isinstance( items, CommandCursor ) or isinstance( items, Cursor ) ):
        items = list(items)
      else:
        items = [items]

      logger.info( "count: {}".format( len(items) ) )

      return items
    return wrapper

  @classmethod
  def insert(cls, func):
    @wraps(func)
    def wrapper(*args, **kwargs):
      result = func(*args, **kwargs)

      logger.info( "inserted: {}".format( len(result.inserted_ids) ) )

      return result
    return wrapper