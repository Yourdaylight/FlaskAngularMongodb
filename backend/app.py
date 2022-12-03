from flask import Flask, render_template
from flask_cors import CORS
import config
from user import user
from list import _list
from comment import comment

app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config.from_object(config)
app.config['JSON_AS_ASCII'] = False
app.register_blueprint(user, url_prefix="/")
app.register_blueprint(_list, url_prefix="/")
app.register_blueprint(comment, url_prefix="/")
app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'
app.run(debug=True)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


def check_intial():
    """检查数据库是否有数据，没有则初始化"""
    with open("initial.txt", "r") as f:
        initial = f.read()
    if initial.strip() == "0":
        from downloadMusic import read_json_to_db
        read_json_to_db()
        with open("initial.txt", "w") as f:
            f.write("1")


if __name__ == '__main__':
    print("start")
    check_intial()
    app.run(host='0.0.0.0', port=5000, debug=True)
