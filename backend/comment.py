from flask import Blueprint, request
import json
import time
from config import client
from crawler import get_weather_data, save_weather_data

comment = Blueprint('comment', __name__);
dbComment = client["crawler"]["comment"]


@comment.route('/addComment', methods=['POST'])
def add_comment():
    try:
        username = request.json.get('username')
        name = request.json.get('name')
        comment = request.json.get('comment')
        timeStamp_checkpoint = int(time.time())
        timeArray = time.localtime(timeStamp_checkpoint)
        checkpoint = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        dbComment.insert_one({
            "name": name,
            "username": username,
            "comment": comment,
            "update_time": checkpoint
        })
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@comment.route('/getComments', methods=['POST'])
def get_comments():
    try:
        name = request.json.get('name')
        username = request.json.get('username')
        comments = dbComment.find({"name": name, "username": username})
        _comments = []
        for i in comments:
            i.pop('_id')
            _comments.append(i)
        content = {"code": 0, "msg": "SUCCESS", "data": _comments}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@comment.route('/removeComment', methods=['POST'])
def remove_comment():
    try:
        name = request.json.get('name')
        username = request.json.get('username')
        comment = request.json.get('comment')
        rtn = dbComment.delete_one({"name": name, "username": username, "comment": comment})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
