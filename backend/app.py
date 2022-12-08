from flask import Flask, render_template
from flask_cors import CORS
import db
import json
from user import user
from movie_view import movie
from comment_view import comment
from utils import read_dataset
app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config.from_object(db)
app.config['JSON_AS_ASCII'] = False
app.register_blueprint(user, url_prefix="/")
app.register_blueprint(movie, url_prefix="/")
app.register_blueprint(comment, url_prefix="/")
app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'
app.run(debug=True)


if __name__ == '__main__':
    if db.get_db():
        read_dataset()
    app.run(host='127.0.0.1', port=5000, debug=True)
