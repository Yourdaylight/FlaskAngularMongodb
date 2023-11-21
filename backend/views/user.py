import json
import uuid
from flask import Blueprint, request
from config import client, DATABASE_NAME

# 设置数据库连接
database = client[DATABASE_NAME]
users_collection = database["user"]

# 定义 Blueprint
user_blueprint = Blueprint('user_blueprint', __name__)


def create_auth_token(user_identifier):
    # 生成认证 Token
    return str(uuid.uuid3(user_identifier))


@user_blueprint.route('/api/v1/games/login', methods=['POST'])
def user_login():
    # 获取用户名和密码
    user_name = request.json.get('username')
    user_pass = request.json.get('password')

    try:
        # 查询数据库用户
        found_user = users_collection.find_one({"username": user_name, "password": user_pass})
        if found_user:
            auth_token = create_auth_token(found_user.get("username"))
            response = {"code": 200, "message": "Login successful.", "data": {"token": auth_token}}
        else:
            response = {"code": 500, "message": "Invalid credentials"}
    except Exception as error:
        print(error)
        response = {"code": 500, "message": str(error)}
    return json.dumps(response)


@user_blueprint.route('/api/v1/games/register', methods=['POST'])
def user_registration():
    try:
        user_name = request.json.get('username')
        user_pass = request.json.get('password')
        # 检查用户是否已存在
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
