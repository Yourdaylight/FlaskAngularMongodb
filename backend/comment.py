from flask import Blueprint, request
import json
import time
from config import client, JSONEncoder

comment = Blueprint('comment', __name__);
dbComment = client["crawler"]["comment"]


@comment.route('/addComment', methods=['POST'])
def add_comment():
    try:
        _id = request.json.get('_id')
        name = request.json.get('name', "")
        username = request.json.get('username')
        content = request.json.get('comment')
        now = int(time.time())
        format_now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now))
        dbComment.insert_one({
            "game_id": _id,
            "name": name,
            "username": username,
            "comment": content,
            "update_time": format_now
        })
        content = {"code": 0, "msg": "SUCCESS","data": {"update_time": format_now}}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@comment.route('/getComments', methods=['POST'])
def get_comments():
    try:
        game_id = request.json.get('game_id')
        comments = dbComment.find({"game_id": game_id})
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
        dbComment.delete_one({"_id": _id})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
