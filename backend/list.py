from flask import Blueprint, request
import json
from utils import get_date, get_data
import datetime
from config import client
from crawler import get_weather_data, save_weather_data

list = Blueprint('list', __name__);
dbUser = client["crawler"]
dbStock = client["stock"]


@list.route('/userStockList', methods=['POST'])
def stock_list():
    try:
        username = request.json.get("username")
        stock_list = dbUser["user"].find_one({"username": username})
        stock_list = stock_list.get("stock")
        res = []
        stock_ids = []
        if stock_list:
            # 获取用户收藏的所有股票代码
            stock_codes = dbStock["stock"].find({"code": {"$in": stock_list}})
            for stock in stock_codes:
                stock_code = stock.get("code")
                if stock_code not in stock_ids and stock["catagory"] == "上证A股":
                    stock.pop("_id")
                    # 获取股票的最新一个交易日的数据
                    recent_data = dbStock["data"].find_one({
                        "code": stock["code"]
                    })
                    if recent_data:
                        recent_data.pop("_id")
                        # 获取股票涨跌幅判断股票是涨还是跌
                        if float(recent_data["change"]) > 0:
                            recent_data["color"] = "red"
                        else:
                            recent_data["color"] = "green"
                        stock["recent_data"] = recent_data
                    else:
                        stock["recent_data"] = {}
                    stock_ids.append(stock_code)
                    res.append(stock)
        content = {"code": 0, "msg": "SUCCESS", "data": res, "total": len(res)}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/plotStock', methods=['POST'])
def plot_stock():
    try:
        username = request.json.get("username")
        code = request.json.get("code")
        print(request.json)
        stock_data = dbStock["data"].find({"code": code, "username": username})
        date = []
        close = []
        for data in stock_data:
            date.append(data["date"])
            close.append(float(data["close"]))
        content = {"code": 0, "msg": "SUCCESS", "data": {"date": date, "close": close}}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)


@list.route('/updateStockData', methods=['POST'])
def update_stock_data():
    try:
        username = request.json.get("username")
        stock_list = dbUser["user"].find_one({"username": username})
        stock_list = stock_list.get("stock")
        # 爬取用户收藏的所有股票代码
        if stock_list:
            for code in stock_list:
                get_data(username, code)
        content = {"code": 0, "msg": "SUCCESS"}
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
        dbStock["data"].delete_many({"code": stock}, {"username": username})
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
            "data": [],
            "total": dbStock["stock"].count_documents({"catagory": "上证A股"})
        }
        for stock in stock_list:
            stock.pop("_id")
            res["data"].append(stock)
        content = {"code": 0, "msg": "SUCCESS", "data": res}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return json.dumps(content)
