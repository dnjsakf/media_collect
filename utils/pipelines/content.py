from utils.common import logging
from utils.common.decorators.database import MongoDbDecorator as mongo

@mongo.connect("test", "contents")
def getData(conn=None):
  # return conn.find_one()
  return conn.aggregate([
    { 
      "$match": { "cate": "stars" } 
    },
    {
      "$addFields": {
        "_id": { "$toString": "$_id" }
        , "no": { "$toInt": "$no" }
      }
    },
    {
      "$project": {
        "_id": 1
        , "subject": 1
        , "link": 1
        , "author": 1
        , "load_dttm": 1
      }
    },
    { "$sort": { "load_dttm": -1 } },
    { "$limit": 5}
  ])