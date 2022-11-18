from flask import Flask, render_template
from flask_cors import CORS
import config
from user import user
from list import list

app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config.from_object(config)
app.config['JSON_AS_ASCII'] = False
app.register_blueprint(user, url_prefix="/")
app.register_blueprint(list, url_prefix="/")
app.config["SECRET_KEY"] = 'TPmi4aLWRbyVq8zu9v82dWYW1'
app.run(debug=True)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
