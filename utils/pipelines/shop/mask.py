from utils.common.decorators.database import MongoDbDecorator as mongo

@mongo.connect("test", "shop_mask_product")
@mongo.select
def selectProductList(conn, shop):
  return conn.aggregate([
    { 
      "$match": { "shop": shop }
    },
    { "$sort": { "price": 1 }}
  ])

@mongo.connect("test", "shop_mask_product")
@mongo.insert
def insertProductList(conn, product_list):
  return conn.insert_many(product_list)
