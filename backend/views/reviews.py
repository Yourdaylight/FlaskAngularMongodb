import uuid
import time
import datetime
from bson import ObjectId
from flask import Blueprint, request, jsonify
from config import client, DATABASE_NAME, COLLECTION

review = Blueprint('review', __name__)
game_collection = client[DATABASE_NAME][COLLECTION]


@review.route('/api/v1/addReview', methods=['POST'])
def add_review():
    try:
        game_id = request.json.get('_id')
        username = request.json.get('username')
        content = request.json.get('review')
        format_now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        review_document = {
            "review_id": str(uuid.uuid1()),
            "username": username,
            "review": content,
            "update_time": format_now,
            "timestamp": int(time.time())
        }
        game_collection.update_one(
            {"_id": ObjectId(game_id)},
            {"$push": {"reviews": review_document}}
        )
        content = {"code": 200, "msg": "SUCCESS", "data": {"update_time": format_now}}
    except Exception as e:
        content = {"code": 500, "msg": str(e)}
    return jsonify(content)


@review.route('/api/v1/getReviews', methods=['POST'])
def get_reviews():
    try:
        game_id = request.json.get('gameId')
        game_document = game_collection.find_one({"_id": ObjectId(game_id)}, {"reviews": 500})
        reviews = game_document.get("reviews", [])
        reviews.sort(key=lambda x: x["timestamp"], reverse=True)
        content = {"code": 200, "msg": "SUCCESS", "data": reviews}
    except Exception as e:
        content = {"code": 500, "msg": str(e)}
    return jsonify(content)


@review.route('api/v1/deleteReview', methods=['POST'])
def remove_review():
    try:
        game_id = request.json.get('gameId')
        review_id = request.json.get('review_id')
        game_collection.update_one(
            {"_id": ObjectId(game_id)},
            {"$pull": {"reviews": {"review_id": review_id}}}
        )
        content = {"code": 0, "msg": "SUCCESS"}
    except Exception as e:
        content = {"code": 1, "msg": str(e)}
    return jsonify(content)

