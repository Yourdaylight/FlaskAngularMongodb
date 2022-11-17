from flask import Flask, render_template
from flask_cors import CORS
# 引用数据库配置文件
from flask_migrate import Migrate

import config
# 引用数据库
from user.index import *
from list.index import *
from intention.index import *
app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config.from_object(config)
app.config['JSON_AS_ASCII'] = False
db.init_app(app)
app.register_blueprint(user, url_prefix="/")
app.register_blueprint(list, url_prefix="/")
app.register_blueprint(intention, url_prefix="/")
app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'
app.run(debug=True)
migrate = Migrate(app, db)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
