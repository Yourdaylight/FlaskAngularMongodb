from flask import Blueprint, request, jsonify
from utils import JSONEncoder
from bson import ObjectId
from db import client

_list = Blueprint('_list', __name__);
dbUser = client["crawler"]



@_list.route('/musicList', methods=['POST', 'GET'])
def music_list():
    try:
        dbMusic = client["crawler"]["music"]
        _music = dbMusic.find()
        music_list = []
        for i in _music:
            i.pop('privilege', "")
            music_list.append(i)
        content = {"code": 0, "msg": "SUCCESS", "data": music_list}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@_list.route('/addSong', methods=['POST', 'GET'])
def add_song():
    try:
        name = request.json.get('name')
        artist = request.json.get('artist')
        album = request.json.get('album')
        pic_url = request.json.get('picUrl')
        duration = request.json.get('duration')
        dbMusic = client["crawler"]["music"]
        dbMusic.insert_one({
            "name": name,
            "album": {"name": album, "picUrl": pic_url},
            "artists": [{"name": artist}],
            "duration": duration
        })
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)

@_list.route('/deleteSong', methods=['POST', 'GET'])
def delete_song():
    try:
        id = request.json.get('_id')
        dbMusic = client["crawler"]["music"]
        dbMusic.delete_one({"_id": ObjectId(id)})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)

@_list.route('/collect', methods=['POST', 'GET'])
def collect():
    try:
        username = request.json.get("username")
        music_name = request.json.get("name")
        dbUser = client["crawler"]["user"]
        dbUser.update_one({"username": username}, {"$addToSet": {"collect": music_name}})
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@_list.route('/collectList', methods=['POST', 'GET'])
def collect_list():
    try:
        username = request.json.get("username")
        dbUser = client["crawler"]["user"]
        _user = dbUser.find_one({"username": username})
        collect_list = _user["collect"]
        res = []
        for music in collect_list:
            dbMusic = client["crawler"]["music"]
            _music = dbMusic.find_one({"name": music})
            if _music:
                _music.pop('privilege')
                res.append(_music)
        content = {"code": 0, "msg": "SUCCESS", "data": res}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 1, "msg": str(e)}
    return JSONEncoder().encode(content)


@_list.route('/deleteCollect', methods=['POST', 'GET'])
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
