from utils.common import logging

from pymongo import MongoClient
from config import MONGO_CONNECT

logger = logging.getLogger(__name__)

class MongoDB(object):
  conn = None
    
  def connect(self, *args, **kwargs):
    conn = MongoClient(MONGO_CONNECT)
    try:
      info = conn.server_info()

      logger.info( "MongoDB connected!!!" )
      logger.debug( info )
    except Exception as e:
      logger.error( e )
    finally:
      return conn

  def close(self):
    if self.conn is not None:
      self.conn.close()

  @property
  def conn(self):
    return self.conn