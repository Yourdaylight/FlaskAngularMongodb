import pymongo
import traceback
db_host = "101.35.53.113"
password = "LZHlzh.rootOOT123"
client = pymongo.MongoClient(db_host, username="admin", password=password)
DATABASE_NAME = "games"
COLLECTION = "games"
DATASET_PATH = "dataset/games.csv"


def get_user_collection():
    return client[DATABASE_NAME]["user"]


def get_db():
    try:
        _collection = client[DATABASE_NAME]
        is_exist = _collection[COLLECTION].count()
        print(f"{COLLECTION} is exist: {is_exist}")
        return is_exist != 0
    except Exception as e:
        raise e
