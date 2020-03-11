from routes import app
from flask import render_template, jsonify
from utils.pipelines.common import menus

@app.route("/menus", methods=["GET"])
def getMenuList():

  menu_list = menus.selectMenuList()

  return jsonify({
    "success": True,
    "payload": {
      "list": menu_list
    }
  })
