from flask import Flask, render_template
from flask_cors import CORS
import config
import json
from user import user
from game import game_route
from comment import comment
app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config.from_object(config)
app.config['JSON_AS_ASCII'] = False
app.register_blueprint(user, url_prefix="/")
app.register_blueprint(game_route, url_prefix="/")
app.register_blueprint(comment, url_prefix="/")
app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'
app.run(debug=True)


def initial_data():
    """初始化数据"""
    with open("config.json", "r") as f:
        check_status = json.loads(f.read())
    if check_status["has_db"]:
        return
    else:
        from getData import save_to_db
        save_to_db()
        with open("config.json", "w") as f:
            f.write(json.dumps({"has_db": True}))


if __name__ == '__main__':
    initial_data()
    app.run(host='127.0.0.1', port=5000, debug=True)
