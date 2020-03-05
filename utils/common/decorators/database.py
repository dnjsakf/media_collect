from functools import wraps

from pymongo.cursor import Cursor
from pymongo.command_cursor import CommandCursor
      
from utils.common import logging
from utils.common.connectors import Connector

class MongoDbDecorator(object):
  @classmethod
  def connect(cls, database=None, document=None):
    logger = logging.getLogger("{}.{}".format(__name__, cls.__name__))

    def decorator(func):
      @wraps(func)
      def wrapper(*args, **kwargs):
        conn = Connector.connect("mongo")

        items = func(conn=conn[database][document])

        if( isinstance( items, CommandCursor ) or isinstance( items, Cursor ) ):
          items = list(items)
        else:
          items = [items]

        logger.info( "count: {}".format( len(items) ) )
        
        #Connector.close()
        #Connector.clear()

        return items
      return wrapper
    return decorator

