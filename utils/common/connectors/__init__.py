from utils.common.connectors.mongo import MongoDB

class Connector(object):
  database = None
  conn = None

  @classmethod
  def connect(cls, dbname, *args, **kwargs):
    if dbname == "mongo":
      cls.database = MongoDB()
      cls.conn = cls.database.connect()

    elif dbname == "others":
      pass

    return cls.conn

  @classmethod
  def close(cls):
    if( cls.conn is not None ):
      cls.conn.close()
    cls.conn = None