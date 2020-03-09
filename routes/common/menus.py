from routes import app
from flask import render_template, jsonify
from utils.pipelines.common.menus import selectMenuList

@app.route("/menus", methods=["GET"])
def getMenuList():

  menu_list = selectMenuList()

  return jsonify({"html": render_template("templates/common/menus.html", menu_list=menu_list)})
