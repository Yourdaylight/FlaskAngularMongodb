import json
import traceback
from flask import Blueprint, request, jsonify
from utils import get_token
from config import client, DATABASE_NAME, USER_COLLECTION

db = client[DATABASE_NAME]
dbUser = db["user"]
user = Blueprint('user', __name__)
user_collection = client[DATABASE_NAME][USER_COLLECTION]


@user.route('/api/v1/games/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    # 登录校验
    try:
        login_user = dbUser.find_one({"username": username, "password": password})
        if login_user:
            token = get_token(login_user.get("username"))
            content = {"code": 200, "msg": "SUCCESS",
                       "data": {"token": token}}
        else:
            content = {"code": 500, "msg": "username or password is wrong!"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 500, "msg": str(e)}
    return jsonify(content)


@user.route('/api/v1/games/register', methods=['POST'])
def register():
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        # 校验是否已经注册
        regist_user = dbUser.find_one({"username": username, "password": password})
        if not regist_user:
            regist_user = {"username": username, "password": password}
            dbUser.insert_one(regist_user)
            content = {"code": 200, "msg": "SUCCESS"}
        else:
            content = {"code": 500, "msg": "Register failed! The username already exists!!"}
    except Exception as e:
        traceback.print_exc()
        content = {"code": 500, "msg": str(e)}
    return jsonify(content)


# 收藏游戏
@user.route('/api/v1/games/collectGame', methods=['POST', 'GET'])
def collect_game():
    try:
        username = request.json.get("username")
        game_id = request.json.get("gameId")
        user_collection.update_one({"username": username}, {"$addToSet": {"collect": game_id}})
        content = {"code": 200, "msg": "SUCCESS"}
    except Exception as e:
        traceback.print_exc()
        content = {"code": 500, "msg": str(e)}
    return jsonify(content)


# 取消收藏
@user.route('/api/v1/games/cancelCollectGame', methods=['POST', 'GET'])
def cancel_collect_game():
    try:
        username = request.json.get("username")
        game_id = request.json.get("gameId")
        user_collection.update_one({"username": username}, {"$pull": {"collect": game_id}})
        content = {"code": 200, "msg": "SUCCESS"}
    except Exception as e:
        traceback.print_exc()
        content = {"code": 500, "msg": str(e)}
    return jsonify(content)
