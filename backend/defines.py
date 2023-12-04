import pandas
import pymongo

db_host = "127.0.0.1"
db_port = 27017
password = "123456"
client = pymongo.MongoClient(db_host, db_port, username="admin", password=password)
DATABASE_NAME = "wegame"
COLLECTION = "wegame"
USER_COLLECTION = "user"
DATASET_PATH = "dataset/games2.csv"


def read_dataset():
    data = pandas.read_csv(DATASET_PATH, encoding='gbk')
    data = data.fillna("")
    data = data.to_dict(orient="records")
    database = client[DATABASE_NAME]
    list_data = []
    for item in data:
        list_data.append(item)
    database[COLLECTION].insert_many(list_data)
    return data


def get_db():
    try:
        _collection = client[DATABASE_NAME]
        is_exist = _collection[COLLECTION].count_documents({})
        print(f"{COLLECTION} is exist: {is_exist}")
        return is_exist != 0
    except Exception as e:
        raise e
