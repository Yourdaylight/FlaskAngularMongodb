import pymongo

db_host = "101.35.53.113"
client = pymongo.MongoClient(f"mongodb://{db_host}:27017/")
database_name = "netflix"
collection = "netflix"


def get_user_collection():
    return client[database_name]["user"]


def get_db():
    _collection = client[database_name]
    if _collection[collection].count() == 0:
        return True
    else:
        return False
