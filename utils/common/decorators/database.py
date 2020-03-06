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
        conn = Connector.connect("mongo")

        print( conn )
        return func(conn[database][document], *args, **kwargs)
      return wrapper
    return decorator

  @classmethod
  def select(cls, func):
    @wraps(func)
    def wrapper(*args, **kwargs):
      items = func(*args, **kwargs)

      if( isinstance(items, CommandCursor) or isinstance(items, Cursor)):
        items = list(items)
      else:
        items = [items]

      logger.info("count: {}".format(len(items)))

      return items
    return wrapper

  @classmethod
  def insert(cls, func):
    @wraps(func)
    def wrapper(*args, **kwargs):
      result = func(*args, **kwargs)

      logger.info("inserted: {}".format(len(result.inserted_ids)))
      logger.debug("inserted: {}".format(",".join([ str(object_id) for object_id in result.inserted_ids ])))

      return result
    return wrapper

  @classmethod
  def upsert(cls, func):
    @wraps(func)
    def wrapper(*args, **kwargs):
      result = func(*args, **kwargs)

      logger.info("matched: {}, inserted: {}, upserted: {}, modified: {}".format(
        result.matched_count
        , result.inserted_count
        , result.modified_count
        , result.upserted_count
        , result.modified_count 
      ))
      logger.debug("upserted: {}".format(",".join([ str(object_id) for object_id in result.upserted_ids ])))

      return result
    return wrapper