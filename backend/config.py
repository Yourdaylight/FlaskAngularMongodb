import pymongo

# Azure Cosmos DB connection string
cosmos_db_uri = "mongodb://games:oQ5bO7YMfpu99oZMpKs0fjjypybyIMwBHJh7TmK8FYj1J41StnByDp1vxZ0huSXxlYbNLiRtNdvZACDb9cByMQ==@games.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@games@"

# Create a MongoClient
client = pymongo.MongoClient(cosmos_db_uri)
DATABASE_NAME = "games"
COLLECTION = "games"
USER_COLLECTION = "user"
DATASET_PATH = "dataset/games.csv"


def get_user_collection():
    return client[DATABASE_NAME]["user"]


def get_db():
    try:
        _collection = client[DATABASE_NAME]
        is_exist = _collection[COLLECTION].count_documents({})
        print(f"{COLLECTION} is exist: {is_exist}")
        return is_exist != 0
    except Exception as e:
        raise e
