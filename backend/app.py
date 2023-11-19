import time
import traceback
from flask import Flask
from flask_cors import CORS
import config as db
from views.user import user
from views.games import game
from views.comments import comment
from utils import read_dataset


if __name__ == '__main__':
    # 如果数据库为空，则读取数据集并存入数据库
    try:
        if not db.get_db():
            read_dataset()
        time.sleep(1)
        app = Flask(__name__)
        CORS(app, supports_credentials=True)
        app.config.from_object(db)
        app.config['JSON_AS_ASCII'] = False
        app.register_blueprint(user, url_prefix="/")
        app.register_blueprint(game, url_prefix="/")
        app.register_blueprint(comment, url_prefix="/")
        app.config["SECRET_KEY"] = 'game dataset'
        app.run(debug=True)
        app.run(host='127.0.0.1', port=5000, debug=True)
    except Exception:
        traceback.print_exc()
