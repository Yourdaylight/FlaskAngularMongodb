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
        res = []
        for city in cityList:
            detail = dbUser["weather"].find_one({"city": city})
            if detail is None:
                detail = get_weather_data(city)
                save_weather_data(detail)
            if detail:
                temp = detail
                temp.pop("_id")
                temp.pop("next_days")
                temp["name"] = city
                temp["list"] = cityList
                res.append(temp)
        content = {"code": 0, "msg": "SUCCESS", "data": res}
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
        dbUser["weather"].delete_one({"city": city})
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
            print(weather)
            content = {"code": 0, "msg": "SUCCESS", "data": weather}
            save_weather_data(weather)
            weather.pop("_id", None)
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
