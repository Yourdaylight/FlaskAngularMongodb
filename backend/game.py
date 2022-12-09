from flask import Blueprint, request, jsonify
import json
import bson
import time
from bson import ObjectId
from config import client, JSONEncoder

game_route = Blueprint('game_route', __name__);
dbUser = client["game"]["user"]



@game_route.route('/gameList', methods=['POST', 'GET'])
def game_list():
    try:
        page = request.json.get("page", 1)
        size = request.json.get("size", 10)
        search = request.json.get("search", "")
        params = {}
        if search:
            params = {
                "$or": [
                    {"name": {"$regex": search}},
                    {"fps": {"$regex": search}},
                ]}
        Game = client["game"]["game"]
        data = Game.find(params).skip((page - 1) * size).limit(size).sort("update_time", -1)
        res = []
        for i in data:
            i["fps"] = i["fps"].split(",")
            res.append(i)
        total = Game.count_documents(params)
        content = {"code": 0, "total": total, "data": res, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@game_route.route('/addGame', methods=['POST', 'GET'])
def add_game():
    try:
        name = request.json.get("name")
        fps = request.json.get("fps")
        if isinstance(fps, list):
            fps = ",".join(fps)
        img_src = request.json.get("img_src")
        Game = client["game"]["game"]
        Game.insert_one({
            "name": name,
            "fps": fps,
            "img_src": img_src,
            "update_time": int(time.time())
        })
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@game_route.route('/deleteGame', methods=['POST', 'GET'])
def delete_game():
    try:
        id = request.json.get("_id")
        Game = client["game"]["game"]
        Game.delete_one({"_id": ObjectId(id)})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@game_route.route('/updateGame', methods=['POST', 'GET'])
def update_game():
    try:
        id = request.json.get("_id")
        name = request.json.get("name")
        fps = request.json.get("fps")
        if isinstance(fps, list):
            fps = ",".join(fps)
        img_src = request.json.get("img_src")
        Game = client["game"]["game"]
        Game.update_one({"_id": ObjectId(id)}, {"$set": {
            "name": name,
            "fps": fps,
            "img_src": img_src,
            "update_time": int(time.time())
        }})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@game_route.route('/addFavorite', methods=['POST', 'GET'])
def add_favorite():
    try:
        username = request.json.get("username")
        game_id = request.json.get("_id")
        dbUser = client["game"]["user"]
        dbUser.update_one({"username": username}, {"$addToSet": {"favorite": game_id}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@game_route.route('/deleteFavorite', methods=['POST', 'GET'])
def delete_favorite():
    try:
        username = request.json.get("username")
        game_id = request.json.get("_id")
        dbUser = client["game"]["user"]
        dbUser.update_one({"username": username}, {"$pull": {"favorite": game_id}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}

    return JSONEncoder().encode(content)


@game_route.route('/favoriteList', methods=['POST', 'GET'])
def favorite_list():
    try:
        username = request.json.get("username")
        dbUser = client["game"]["user"]
        user = dbUser.find_one({"username": username})
        favorite = user.get("favorite", [])
        Game = client["game"]["game"]
        data = Game.find({"_id": {"$in": [ObjectId(i) for i in favorite]}})
        res = []
        for i in data:
            i["fps"] = i["fps"].split(",")
            res.append(i)
        content = {"code": 0, "data": res, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)
