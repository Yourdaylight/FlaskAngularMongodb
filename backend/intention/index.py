import random
import time

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
from flask import Blueprint, request, Response, jsonify, render_template, redirect, url_for, session
import json

from intention.model import Intention
from list.model import School
from user.utils import verify_token

intention = Blueprint('intention', __name__);


@intention.route('/addIntention', methods=['POST'])
def addIntention():
    token = request.headers.get("token", None)
    is_success, user_id = verify_token(token)
    if not is_success:
        content = {"code": 405, "msg": "登陆过期"}
        return json.dumps(content)
    sid = request.json.get("sid")
    school = School.query.filter(
        School.id == sid
    ).first()
    now = time.strftime('%y-%m-%d %H:%M:%S', time.localtime(time.time()))
    intention = Intention(None, user_id, school.title, school.score, now)
    db.session.add(intention)
    db.session.commit()
    content = {"code": 0, "msg": "SUCCESS"}
    return json.dumps(content)


@intention.route('/intentionList')
def intentionList():
    token = request.headers.get("token", None)
    is_success, user_id = verify_token(token)
    if not is_success:
        content = {"code": 405, "msg": "登陆过期"}
        return json.dumps(content)
    intentionList = Intention.query.filter(
        Intention.uid == user_id
    ).all()
    data = [intention.instance_to_json() for intention in intentionList]
    content = {"code": 0, "msg": "SUCCESS", "data": data if data else []}
    return json.dumps(content)


@intention.route('/delIntention', methods=['POST'])
def delIntention():
    id = request.json.get('id')
    intention = Intention.query.filter(
        Intention.id == id
    ).first()
    db.session.delete(intention)
    db.session.commit()
    content = {"code": 0, "msg": "SUCCESS"}
    return json.dumps(content)
