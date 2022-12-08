from flask import Blueprint, request
import json
from bson import ObjectId
import time
import datetime
from db import client
from utils import JSONEncoder

comment = Blueprint('comment', __name__);
comment_collection = client["netflix"]["comment"]


@comment.route('/addComment', methods=['POST'])
def add_comment():
    try:
        _id = request.json.get('_id')
        username = request.json.get('username')
        content = request.json.get('comment')
        format_now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        comment_collection.insert_one({
            "movie_id": _id,
            "username": username,
            "comment": content,
            "update_time": format_now,
            "timestamp": int(time.time())
        })
        content = {"code": 0, "msg": "SUCCESS", "data": {"update_time": format_now}}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@comment.route('/getComments', methods=['POST'])
def get_comments():
    try:
        game_id = request.json.get('movie_id')
        comments = comment_collection.find({"movie_id": game_id}).sort("timestamp", -1)
        res = []
        for i in comments:
            i["comment_id"] = i.pop("_id")
            res.append(i)
        content = {"code": 0, "msg": "SUCCESS", "data": res}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@comment.route('/deleteComment', methods=['POST'])
def remove_comment():
    try:
        _id = request.json.get('comment_id')
        comment_collection.delete_one({"_id": ObjectId(_id)})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
