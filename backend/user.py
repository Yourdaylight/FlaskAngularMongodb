import json
from flask import Blueprint, request
from utils import get_token
from db import client,database_name

db = client[database_name]
dbUser = db["user"]
user = Blueprint('user', __name__)


@user.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    # 登录校验
    try:
        login_user = dbUser.find_one({"username": username, "password": password})
        if login_user:
            token = get_token(login_user.get("username"))
            content = {"code": 0, "msg": "SUCCESS",
                       "data": {"token": token}}
        else:
            content = {"code": 1, "msg": "用户数据错误"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@user.route('/register', methods=['POST'])
def register():
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        # 校验是否已经注册
        regist_user = dbUser.find_one({"username": username, "password": password})
        if not regist_user:
            regist_user = {"username": username, "password": password}
            dbUser.insert_one(regist_user)
            content = {"code": 0, "msg": "SUCCESS"}
        else:
            content = {"code": 1, "msg": "Register failed! The username already exists!!"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
