import random
import time
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from flask import Blueprint, request
import json

from config import client
from crawler import get_weather_data, save_weather_data
list = Blueprint('list', __name__);
dbUser = client["crawler"]


@list.route('/cityList', methods=['POST', 'GET'])
def city_list():
    try:
        username = request.json.get("username")
        cityList = dbUser["user"].find_one({"username": username})
        cityList = cityList["city"]
        content = {"code": 0, "msg": "SUCCESS", "data": [{"name": city, "list": cityList} for city in cityList]}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/addCity', methods=['POST'])
def add_city():
    try:
        city = request.json.get('city')
        username = request.json.get('username')
        dbUser["user"].update_one({"username": username}, {"$push": {"city": city}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/removeCity', methods=['POST'])
def remove_city():
    try:
        city = request.json.get('name')
        username = request.json.get('username')
        city_list = request.json.get('list')
        print(request.json)
        city_list.remove(city)
        rtn = dbUser["user"].update_one({"username": username}, {"$set": {"city": city_list}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/cityWeather', methods=['POST'])
def city_weather():
    try:
        city = request.json.get('city', 'beijing')
        _weather = dbUser["weather"].find_one({"city": city})
        if _weather:
            _weather.pop("_id")
            content = {"code": 0, "msg": "SUCCESS", "data": _weather}
        else:
            weather = get_weather_data(city)
            save_weather_data(weather)
            content = {"code": 0, "msg": "SUCCESS", "data": weather}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
