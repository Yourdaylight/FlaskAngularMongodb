import json
import traceback
import uuid
from flask import Flask, request
from flask_cors import CORS
import config as db_config
from utils import read_dataset

# 设置数据库连接
database = db_config.client[db_config.DATABASE_NAME]
users_collection = database["user"]

# 创建 Flask 应用
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.from_object(db_config)
app.config['JSON_AS_ASCII'] = False
app.config["SECRET_KEY"] = '123456'


def create_auth_token(user_identifier):
    # 生成认证 Token
    return str(uuid.uuid3(user_identifier))


@app.route('/api/v1/games/login', methods=['POST'])
def user_login():
    user_name = request.json.get('username')
    user_pass = request.json.get('password')
    try:
        found_user = users_collection.find_one({"username": user_name, "password": user_pass})
        if found_user:
            response = {
                "code": 200,
                "message": "Login successful.",
                "data": {
                    "token": create_auth_token(found_user.get("username"))
                }
            }
        else:
            response = {"code": 500, "message": "Invalid credentials"}
    except Exception as error:
        print(error)
        response = {"code": 500, "message": str(error)}
    return json.dumps(response)


@app.route('/api/v1/games/register', methods=['POST'])
def user_registration():
    try:
        user_name = request.json.get('username')
        user_pass = request.json.get('password')
        existing_user = users_collection.find_one({"username": user_name})
        if not existing_user:
            new_user = {"username": user_name, "password": user_pass}
            users_collection.insert_one(new_user)
            response = {"code": 200, "message": "Registration successful."}
        else:
            response = {"code": 500, "message": "Username already exists."}
    except Exception as error:
        print(error)
        response = {"code": 500, "message": str(error)}
    return json.dumps(response)


if __name__ == '__main__':
    # 初始化数据库
    try:
        if not db_config.get_db():
            read_dataset()

        # 启动 Flask 应用
        app.run(host='127.0.0.1', port=5000, debug=True)
    except Exception:
        traceback.print_exc()
