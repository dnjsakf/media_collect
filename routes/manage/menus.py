from routes import app
from flask import jsonify, render_template, request

from utils.pipelines.manage.menus import insertManageMenu
from utils.pipelines.manage.menus import selectManageMenuList

@app.route("/manage/menus", methods=["GET"])
def selectManageMenus():
  menu_list = selectManageMenuList()
  menu_headers = [ "menu_grp_id", "menu_id", "full_menu", "menu_name", "menu_index", "sort_order" ]

  result = { 
    "html": render_template("templates/manage/menus/menu_list.html" , menu_headers=menu_headers, menu_list=menu_list )
  }

  return jsonify(result)

@app.route("/manage/menus/save", methods=["POST"])
def saveManageMenus():
  body = request.json

  insertManageMenu( body )

  return jsonify({"success": True})