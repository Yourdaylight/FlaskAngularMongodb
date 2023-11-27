import time, json, bson
import datetime
from bson import ObjectId
from defines import client, DATABASE_NAME, COLLECTION, USER_COLLECTION
from flask import Blueprint, request, jsonify, Response

game = Blueprint('game', __name__)
user_collection = client[DATABASE_NAME][USER_COLLECTION]
game_collection = client[DATABASE_NAME][COLLECTION]


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@game.route('/api/wegame/game_list', methods=['POST', 'GET'])
def game_list():
    content = {}
    try:
        # 获取分页参数
        params = request.json or {}
        page, size = params.get("page", 1), params.get("size", 10)

        # 查询参数构造
        filters = {k: {"$regex": v, "$options": "i"} for k, v in params.items()
                   if k in ["Original Price", "Name", "Developer", "Distributor"] and v}

        games_query = game_collection.find(filters)
        games = list(games_query.skip((page - 1) * size).limit(size).sort("update_time", -1))
        total_games = game_collection.count_documents(filters)

        content.update({"code": 200, "total": total_games, "data": games, "msg": "SUCCESS"})
    except Exception as e:
        content = {"code": 500, "msg": f"Error: {e}"}

    return Response(JSONEncoder().encode(content), mimetype='application/json')


@game.route('/api/wegame/new_game', methods=['POST', 'GET'])
def new_game():
    try:
        game_data = request.json
        necessary_fields = "Name"
        # name为必填项
        if not game_data.get(necessary_fields):
            return jsonify({"code": 500, "msg": f"Field: [{necessary_fields}] is required"}), 500
        existing_game = game_collection.find_one({necessary_fields: game_data[necessary_fields]})
        if existing_game:
            return jsonify({
                "code": 500,
                "msg": f"A game with the same title [{game_data[necessary_fields]}] already exists"}
            ), 500

        # 尝试将所有字段转换为float，如果无法转换则保持原始类型
        for key, value in game_data.items():
            try:
                game_data[key] = float(value)
            except (ValueError, TypeError):
                pass  # 如果不能转换成float，保持原始类型
            except Exception as e:
                return jsonify({"code": 500, "msg": str(e)}), 500

        # 添加时间戳
        game_data["date_added"] = datetime.datetime.now().strftime("%Y-%m-%d")
        game_data["update_time"] = time.time()

        # 插入数据
        game_collection.insert_one(game_data)
        return jsonify({"code": 200, "msg": "SUCCESS"})
    except Exception as e:
        return jsonify({"code": 500, "msg": str(e)}), 500


@game.route('/api/wegame/del_game', methods=['POST', 'GET'])
def del_game():
    try:
        game_id = request.json.get("_id")
        if not game_id:
            raise ValueError("Game ID is required")

        deletion_result = game_collection.delete_one({"_id": ObjectId(game_id)})
        if deletion_result.deleted_count == 0:
            raise ValueError("No game found with the provided ID")

        return jsonify({"code": 200, "msg": "Game successfully deleted"})
    except Exception as e:
        return jsonify({"code": 500, "msg": f"Error occurred: {e}"}), 500


@game.route('/api/wegame/update_game', methods=['POST', 'GET'])
def update_game():
    try:
        update_data = request.get_json()
        game_id = update_data.pop('_id', None)
        update_data["update_time"] = time.time()
        if not game_id:
            raise ValueError("Missing game ID")

        game_collection.update_one({"_id": ObjectId(game_id)}, {"$set": update_data})
        return jsonify({"code": 200, "msg": "Game updated successfully"})
    except Exception as e:
        return jsonify({"code": 500, "msg": f"Update failed: {e}"}), 500
