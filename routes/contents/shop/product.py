from routes import app
from flask import jsonify, render_template
from utils.pipelines.contents.shop import product

@app.route('/contents/shop/product/<string:product_name>', methods=["GET"])
def getShopPorudct(product_name=None):
  product_list = product.selectProductList(product_name)

  return jsonify({
    "html": render_template("templates/components/product_list.html", product_list=product_list)
  })