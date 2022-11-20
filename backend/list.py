from flask import Blueprint, request, jsonify
import json
import bson
from bson import ObjectId
from config import client
from crawler import get_weather_data, save_weather_data

_list = Blueprint('_list', __name__);
dbUser = client["crawler"]


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@_list.route('/musicList', methods=['POST', 'GET'])
def music_list():
    try:
        dbMusic = client["crawler"]["music"]
        _music = dbMusic.find()
        music_list = []
        for i in _music:
            music_list.append(i)
        content = {"code": 0, "msg": "SUCCESS", "data": music_list}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)

# @list.route('/addCity', methods=['POST'])
# def add_city():
#     try:
#         city = request.json.get('city')
#         username = request.json.get('username')
#         dbUser["user"].update_one({"username": username}, {"$push": {"city": city}})
#         content = {"code": 0, "msg": "SUCCESS"}
#     except Exception as e:
#         content = {"code": 1, "msg": str(e)}
#     return json.dumps(content)
#
#
# @list.route('/removeCity', methods=['POST'])
# def remove_city():
#     try:
#         city = request.json.get('name')
#         username = request.json.get('username')
#         city_list = request.json.get('list')
#         print(request.json)
#         city_list.remove(city)
#         dbUser["weather"].delete_one({"city": city})
#         rtn = dbUser["user"].update_one({"username": username}, {"$set": {"city": city_list}})
#         content = {"code": 0, "msg": "SUCCESS"}
#     except Exception as e:
#         content = {"code": 1, "msg": str(e)}
#     return json.dumps(content)


# @list.route('/cityWeather', methods=['POST'])
# def city_weather():
#     try:
#         city = request.json.get('city', 'beijing')
#         _weather = dbUser["weather"].find_one({"city": city})
#         if _weather:
#             _weather.pop("_id")
#             content = {"code": 0, "msg": "SUCCESS", "data": _weather}
#         else:
#             weather = get_weather_data(city)
#             print(weather)
#             content = {"code": 0, "msg": "SUCCESS", "data": weather}
#             save_weather_data(weather)
#             weather.pop("_id", None)
#     except Exception as e:
#         content = {"code": 1, "msg": str(e)}
#     return json.dumps(content)
