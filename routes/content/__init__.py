from routes import app
from flask import jsonify, render_template
from utils.pipelines import content

@app.route('/data', methods=["GET"])
def getData():
  items = content.getData()

  return jsonify({
    "html": render_template("templates/components/list.html", items=items)
  })