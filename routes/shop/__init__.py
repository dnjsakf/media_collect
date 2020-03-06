from routes import app
from flask import jsonify, render_template
from utils.pipelines.shop import mask

@app.route('/shop/product/<string:product_name>', methods=["GET"])
@app.route('/shop/product/', methods=["GET"])
def getShopPorudct(product_name=None):
  product_list = mask.selectProductList("coupang")

  return jsonify({
    "html": render_template("templates/components/product_list.html", product_list=product_list)
  })