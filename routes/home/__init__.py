from flask import render_template, jsonify
from routes import app

@app.route("/home", methods=["GET"])
def home():
  return render_template("routes/home.html")
  
@app.route("/home/init", methods=["GET"])
def homeInit():
  
  info = {
    "id": "home_init"
  }
  items = [ { "className": "data-{}".format(idx), "data": "data-{}".format(idx) } for idx in range(10) ]

  return render_template("templates/components/list.html", info=info, items=items)