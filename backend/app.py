import time
import json
import bson
import base64
import random
import traceback
from flask import Flask
from flask_cors import CORS
import config as db
from views.user import user
from views.games import game
from views.reviews import review


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def get_token(user_id):
    token = base64.b64encode(
        (".".join([str(user_id), str(random.random()), str(time.time() + 7200)])).encode()).decode()
    return token


def import_data():
    pass


if __name__ == '__main__':
    # 如果数据库为空，则读取数据集并存入数据库
    try:
        app = Flask(__name__)
        CORS(app, supports_credentials=True)
        app.config.from_object(db)
        app.config['JSON_AS_ASCII'] = False
        app.register_blueprint(user, url_prefix="/")
        app.register_blueprint(game, url_prefix="/")
        app.register_blueprint(review, url_prefix="/")
        app.config["SECRET_KEY"] = 'game dataset'
        app.run(debug=True)
        app.run(host='127.0.0.1', port=5000, debug=True)
    except Exception:
        traceback.print_exc()
