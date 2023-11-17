from flask import Flask, render_template
from flask_cors import CORS
import db
import json
import traceback
from user import user
from movie_view import movie
from comment_view import comment
from utils import read_dataset
import time



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
        app.register_blueprint(movie, url_prefix="/")
        app.register_blueprint(comment, url_prefix="/")
        app.config["SECRET_KEY"] = 'game dataset'
        app.run(debug=True)
        app.run(host='127.0.0.1', port=5000, debug=True)
    except Exception as e:
        traceback.print_exc()
