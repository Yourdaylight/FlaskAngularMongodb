import time
import datetime
from bson import ObjectId
from db import client
from utils import JSONEncoder
from flask import Blueprint, request, jsonify
import numpy as np

movie = Blueprint('movie', __name__);
user_collection = client["netflix"]["user"]
movie_collection = client["netflix"]["netflix"]


@movie.route('/deleteCollect', methods=['POST', 'GET'])
def delete_collect():
    try:
        username = request.json.get("username")
        music_name = request.json.get("name")
        dbUser = client["crawler"]["user"]
        dbUser.update_one({"username": username}, {"$pull": {"collect": music_name}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


""" new """


@movie.route('/getMovies', methods=['POST', 'GET'])
def game_list():
    try:
        page = request.json.get("page", 1)
        size = request.json.get("size", 10)
        search = request.json.get("search", "")
        _type = request.json.get("type", "all")
        params = {}
        if search:
            params = {
                "$or": [
                    {"title": {"$regex": search}},
                    {"director": {"$regex": search}},
                    {"cast": {"$regex": search}},
                    {"country": {"$regex": search}},
                    {"listed_in": {"$regex": search}},
                    {"description": {"$regex": search}}
                ]}
        if _type != "all" and _type != "type":
            params["type"] = _type
        data = movie_collection.find(params).skip((page - 1) * size).limit(size).sort("update_time", -1)
        res = []
        for i in data:
            res.append(i)
        total = movie_collection.count_documents(params)
        content = {"code": 0, "total": total, "data": res, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@movie.route('/addMovie', methods=['POST', 'GET'])
def add_movine():
    try:
        _type = request.json.get("type")
        title = request.json.get("title")
        director = request.json.get("director")
        cast = request.json.get("cast")
        country = request.json.get("country")
        release_year = request.json.get("release_year"),
        duration = request.json.get("duration"),
        listed_in = request.json.get("listed_in"),
        description = request.json.get("description"),
        pic_url = request.json.get("pic_url"),

        movie_collection.insert_one({
            "type": _type,
            "title": title,
            "director": director,
            "cast": cast,
            "country": country,
            "date_added": datetime.datetime.now().strftime("%Y-%m-%d"),
            "release_year": release_year,
            "duration": duration,
            "listed_in": listed_in,
            "description": description,
            "pic_url": pic_url,
            "update_time": time.time()
        })
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@movie.route('/deleteMovie', methods=['POST', 'GET'])
def delete_movie():
    try:
        id = request.json.get("_id")
        movie_collection.delete_one({"_id": ObjectId(id)})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@movie.route('/updateMovie', methods=['POST', 'GET'])
def update_movie():
    try:
        id = request.json.pop("_id")
        movie_collection.update_one({"_id": ObjectId(id)}, {"$set": request.json})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@movie.route('/addFavorite', methods=['POST', 'GET'])
def add_favorite():
    try:
        user_collection.update_one(
            {"username": request.json.get("username", "")},
            {"$addToSet":
                 {"favorite": request.json.get("_id", "")}
             })
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@movie.route('/deleteFavorite', methods=['POST', 'GET'])
def delete_favorite():
    try:
        user_collection.update_one(
            {
                "username": request.json.get("username", "")
            },
            {"$pull":
                 {"favorite": request.json.get("_id", "")}
             })
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@movie.route('/favoriteList', methods=['POST', 'GET'])
def favorite_list():
    try:
        username = request.json.get("username")
        user = user_collection.find_one({"username": username})
        favorite = user.get("favorite", [])
        data = movie_collection.find({"_id": {"$in": [ObjectId(i) for i in favorite]}})
        res = [i for i in data]
        content = {"code": 0, "data": res, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)
