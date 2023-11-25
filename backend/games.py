import time
import datetime
from bson import ObjectId
from config import client, DATABASE_NAME, COLLECTION, USER_COLLECTION
from utils import JSONEncoder
from flask import Blueprint, request, jsonify, Response

game = Blueprint('game', __name__);
user_collection = client[DATABASE_NAME][USER_COLLECTION]
game_collection = client[DATABASE_NAME][COLLECTION]


@game.route('/api/wegame/getGames', methods=['POST', 'GET'])
def game_list():
    try:
        page = request.json.get("page", 1)
        size = request.json.get("size", 10)

        # 获取查询参数
        original_price = request.json.get("Original Price")
        name = request.json.get("Name")
        developer = request.json.get("Developer")
        distributor = request.json.get("Distributor")

        # 构建查询条件
        query_conditions = {}
        # 不区分大小写的模糊查询
        if original_price:
            query_conditions["Original Price"] = {"$regex": original_price, "$options": "i"}
        if name:
            query_conditions["Title"] = {"$regex": name, "$options": "i"}
        if developer:
            query_conditions["Developer"] = {"$regex": developer, "$options": "i"}
        if distributor:
            query_conditions["Publisher"] = {"$regex": distributor, "$options": "i"}

        # 执行查询
        data = game_collection.find(query_conditions).skip((page - 1) * size).limit(size).sort("update_time", -1)
        res = []
        for i in data:
            res.append(i)
        total = game_collection.count_documents(query_conditions)
        content = {"code": 200, "total": total, "data": res, "msg": "SUCCESS"}
        content = JSONEncoder().encode(content)
    except Exception as e:
        content = {"code":500, "msg": str(e)}

    return Response(content, mimetype='application/json')


@game.route('/api/wegame/addGame', methods=['POST', 'GET'])
def add_game():
    try:
        game_data = request.json
        # Title为必填项
        if not game_data.get("Title"):
            return jsonify({"code": 500, "msg": "Field: [Title] is required"}), 400
        existing_game = game_collection.find_one({"Title": game_data.get("Title")})
        if existing_game:
            return jsonify({
                "code": 500,
                "msg": f"A game with the same title [{existing_game}] already exists"}
            ), 400

        # 验证字符串类型的字段
        string_fields = ["Title", "Original Price", "Discounted Price", "Release Date",
                         "Link", "Game Description", "Developer", "Publisher", "Recent Reviews Summary",
                         "All Reviews Summary","Recent Reviews Number", "All Reviews Number",
                         "Minimum Requirements"]
        for field in string_fields:
            if not isinstance(game_data.get(field), str):
                return jsonify({"code": 500, "msg": f"Field:[{field}] should be a string"}), 400

        # 验证列表类型的字段
        list_fields = ["Popular Tags", "Game Features", "Supported Languages"]
        for field in list_fields:
            if not isinstance(game_data.get(field), list):
                return jsonify({"code": 500, "msg": f"Field: [{field}] should be a list"}), 400

        # 添加时间戳
        game_data["date_added"] = datetime.datetime.now().strftime("%Y-%m-%d")
        game_data["update_time"] = time.time()

        # 插入数据
        game_collection.insert_one(game_data)
        return jsonify({"code": 200, "msg": "SUCCESS"})
    except Exception as e:
        return jsonify({"code": 500, "msg": str(e)}), 500


@game.route('/api/wegame/deleteGame', methods=['POST', 'GET'])
def delete_game():
    try:
        id = request.json.get("_id")
        game_collection.delete_one({"_id": ObjectId(id)})
        content = {"code": 200, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 500, "msg": str(e)}
    return JSONEncoder().encode(content)


@game.route('/api/wegame/updateGame', methods=['POST', 'GET'])
def update_game():
    try:
        id = request.json.pop("_id")
        game_collection.update_one({"_id": ObjectId(id)}, {"$set": request.json})
        content = {"code": 200, "msg": "SUCCESS"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        content = {"code": 500, "msg": str(e)}
    return JSONEncoder().encode(content)

