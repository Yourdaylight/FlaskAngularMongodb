from flask import Blueprint, request
import json

from config import client
from crawler import get_weather_data, save_weather_data

list = Blueprint('list', __name__);
dbUser = client["crawler"]
dbStock = client["stock"]


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


@list.route('/userStockList', methods=['POST'])
def stock_list():
    try:
        username = request.json.get("username")
        stock_list = dbUser["user"].find_one({"username": username})
        stock_list = stock_list.get("stock")
        res = []
        if stock_list:
            stock_data = dbStock["stock"].find({"code": {"$in": stock_list}})
            for stock in stock_data:
                stock.pop("_id")
                if stock not in res and stock["catagory"] == "上证A股":
                    res.append(stock)
        content = {"code": 0, "msg": "SUCCESS", "data": res,"total":len(res)}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/addStock', methods=['POST'])
def add_stock():
    try:
        stock = request.json.get('stock')
        username = request.json.get('username')
        if dbStock["stock"].find_one({"code": stock}) is None:
            content = {"code": 1, "msg": "The stock code is not exist"}
            return json.dumps(content)
        dbUser["user"].update_one({"username": username}, {"$push": {"stock": stock}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/removeStock', methods=['POST'])
def remove_stock():
    try:
        stock = request.json.get('code')
        username = request.json.get('username')
        stock_list = dbUser["user"].find_one({"username": username})["stock"]

        stock_list.remove(stock)
        rtn = dbUser["user"].update_one({"username": username}, {"$set": {"stock": stock_list}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route("/getAllStock", methods=['POST'])
def get_all_stock():
    try:
        page = request.json.get("page", 1)
        limit = request.json.get("limit", 10)
        stock_list = dbStock["stock"].find({"catagory": "上证A股"}).skip((page - 1) * limit).limit(limit)
        res = {
            "data":[],
            "total":dbStock["stock"].count_documents({"catagory": "上证A股"})
        }
        for stock in stock_list:
            stock.pop("_id")
            res["data"].append(stock)
        content = {"code": 0, "msg": "SUCCESS", "data": res}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
