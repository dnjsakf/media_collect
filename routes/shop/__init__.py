from routes import app
from flask import jsonify, render_template
from utils.pipelines.shop import product

@app.route('/shop/product/<string:product_name>', methods=["GET"])
def getShopPorudct(product_name=None):
  product_list = product.selectProductList(product_name)

  return jsonify({
    "html": render_template("templates/components/product_list.html", product_list=product_list)
  })