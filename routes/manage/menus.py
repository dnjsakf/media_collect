from routes import app
from flask import jsonify, render_template, request

from utils.pipelines.manage import menus

@app.route("/api/manage/menus/menuList/<int:page>", methods=["GET"])
@app.route("/api/manage/menus/menuList", methods=["GET"])
def getManageMenusMenuList(page=None):
  page = page if page is not None else 1
  rowsCount = int(request.args.get("rowsCount")) if "rowsCount" in request.args else 10

  skip = ( ( page-1 ) * rowsCount ) + 1

  data = menus.selectManageMenuList(skip=skip, rowsCount=rowsCount)
  count = menus.getManageMenuListCount()
  
  maxPage = int(count / rowsCount) + int( 1 if (count % rowsCount) != 0 else 0 )

  return jsonify({
    "success": True,
    "payload": {
      "list": data,
      "page": {
        "current": page,
        "total": count,
        "max": maxPage,
        "rowsCount": rowsCount,
        "start": skip
      }
    }
  })

@app.route("/manage/menus/save", methods=["POST"])
def saveManageMenus():
  body = request.json

  menus.insertManageMenu( body )

  return jsonify({"success": True})