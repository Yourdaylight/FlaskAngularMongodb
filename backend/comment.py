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
        comment = request.json.get('comment')
        timeStamp_checkpoint = 1649755347
        timeArray = time.localtime(timeStamp_checkpoint)
        checkpoint = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        dbComment.insert_one(
            {
                "username": username,
                "comment": comment,
                "update_time": checkpoint
            }
        )
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@comment.route('/getComments', methods=['POST'])
def get_comments():
    try:
        _comments = dbComment.find()
        res = []
        for comment in _comments:
            comment.pop("_id")
            res.append(comment)
        content = {"code": 0, "msg": "SUCCESS", "data": res}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@comment.route('/removeComment', methods=['POST'])
def remove_comment():
    try:
        username = request.json.get('username')
        comment = request.json.get('comment')
        dbComment.delete_one({"username": username, "comment": comment})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
