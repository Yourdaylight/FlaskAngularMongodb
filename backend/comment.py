
from flask import Blueprint, request
import json
import time
from config import client
from crawler import get_weather_data, save_weather_data
comment = Blueprint('comment', __name__);
dbComment= client["crawler"]["weather"]


@comment.route('/addComment', methods=['POST'])
def add_comment():
    try:
        username = request.json.get('username')
        city = request.json.get('city')
        comment = request.json.get('comment')
        timeStamp_checkpoint = 1649755347
        timeArray = time.localtime(timeStamp_checkpoint)
        checkpoint = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        dbComment.update_one(
            {"city": city},
            {"$push": {"comment": {
                "username": username,
                "comment": comment,
                "update_time": checkpoint
            }}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)

@comment.route('/getComments', methods=['POST'])
def get_comments():
    try:
        city = request.json.get('city')
        _comments = dbComment.find_one({"city": city})
        _comments= _comments["comment"]
        content = {"code": 0, "msg": "SUCCESS", "data": _comments}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)

@comment.route('/removeComment', methods=['POST'])
def remove_comment():
    try:
        city = request.json.get('city')
        username = request.json.get('username')
        comment = request.json.get('comment')
        rtn = dbComment.find_one({"city": city})
        res = rtn["comment"]
        for i in range(len(res)):
            if res[i]["username"] == username and res[i]["comment"] == comment:
                res.pop(i)
                break
        dbComment.update_one({"city": city}, {"$set": {"comment": res}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
