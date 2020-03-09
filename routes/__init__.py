import os

from flask import Flask, render_template, jsonify
from flask_cors import CORS

from config import FLASK_CONFIG
from utils.common import logging

logger = logging.getLogger(__file__)

app = None

def createApp(env="dev"):
    global app
    
    app = Flask(__name__, root_path="", static_folder="public", template_folder="public")
    app.config.from_pyfile(FLASK_CONFIG.format(env=env))

    if "CORS" in app.config:
        CORS(app=app, resources=app.config["CORS"])
        
    load_routes(app)

    return app
    
def load_routes(app):
  from routes import common, contents, manage

  @app.route("/", methods=["GET"])
  def getIndex():
    return render_template('index.html')

  @app.route("/temp/<string:menu_grp_id>/<string:menu_id>", methods=["GET"])
  def loadMenuTemplates(menu_grp_id=None, menu_id=None):
    return jsonify({"html": render_template("templates/{}/{}.html".format(menu_grp_id, menu_id))})
  
  return app