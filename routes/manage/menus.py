from routes import app
from flask import jsonify, render_template, request

from utils.pipelines.manage import menus

@app.route("/api/manage/menus/menuList", methods=["GET"])
def getManageMenusMenuList():
  data, headers = menus.selectManageMenuList(header=True)
  return jsonify({
    "success": True,
    "payload": {
      "list": data,
      "headers": headers
    }
  })

@app.route("/manage/menus/save", methods=["POST"])
def saveManageMenus():
  body = request.json

  menus.insertManageMenu( body )

  return jsonify({"success": True})