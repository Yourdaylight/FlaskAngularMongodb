import json
import pymongo
from flask import Blueprint, request
from user.utils import get_token

client = pymongo.MongoClient("localhost", 27017)
db = client["crawler"]
collection = db["user"]
user = Blueprint('user', __name__)


@user.route('/login', methods=['POST'])  # 抖音账号列表
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    # # 查询数据
    user = collection.find_one({"username": username, "password": password})
    # 封装格式
    if user:
        token = get_token(user.get("username"))
        content = {"code": 0, "msg": "SUCCESS",
                   "data": {"token": token}}
    else:
        content = {"code": 1, "msg": "用户数据错误"}
    return json.dumps(content)


@user.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    # 查询数据
    user = collection.find_one({"username": username, "password": password})
    if not user:
        user = {"username": username, "password": password}
        collection.insert_one(user)
        content = {"code": 0, "msg": "SUCCESS"}
    else:
        content = {"code": 1, "msg":"The user already exists"}
    return json.dumps(content)
