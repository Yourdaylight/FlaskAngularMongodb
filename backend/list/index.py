import random
import time
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
from flask import Blueprint, request, Response, jsonify, render_template, redirect, url_for
import json

from list.model import School

list = Blueprint('list', __name__);


@list.route('/removeSchool', methods=['POST'])
def remove_school():
    id = request.json.get('id')
    school = School.query.filter(
        School.id == id
    ).first()
    db.session.delete(school)
    db.session.commit()
    content = {"code": 0, "msg": "SUCCESS"}
    return json.dumps(content)


@list.route('/schoolList', methods=['GET'])
def school_list():
    schoolList = School.query.filter()
    name = request.args.get("name", None)
    if name not in (None, ""):
        schoolList = schoolList.filter(School.title.contains(name))
    start_score = request.args.get("start_score", None)
    if start_score not in (None, ""):
        schoolList = schoolList.filter(School.score >= float(start_score))
    end_score = request.args.get("end_score", None)
    if end_score not in (None, ""):
        schoolList = schoolList.filter(School.score <= float(end_score))
    content = {"code": 0, "msg": "SUCCESS", "data": [school.instance_to_json() for school in schoolList.all()]}
    return json.dumps(content)


@list.route('/addSchool', methods=['POST'])
def add_school():
    title = request.json.get('title')
    number = request.json.get('number')
    desc = request.json.get('desc')
    score = request.json.get('score')
    end_time = request.json.get('end_time')
    end_time = datetime.strptime(end_time, '%Y-%m-%d')
    now = time.strftime('%y-%m-%d %H:%M:%S', time.localtime(time.time()))
    school = School(None, number, title, desc, score, now, end_time)
    db.session.add(school)
    db.session.commit()
    content = {"code": 0, "msg": "SUCCESS"}
    return json.dumps(content)
