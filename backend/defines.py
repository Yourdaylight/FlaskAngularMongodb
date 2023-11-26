import pandas
import pymongo

db_host = "101.35.53.113"
db_port = 27017
password = "LZHlzh.rootOOT123"
client = pymongo.MongoClient(db_host, db_port, username="admin", password=password)
DATABASE_NAME = "employee"
COLLECTION = "employee"
USER_COLLECTION = "user"
DATASET_PATH = "dataset/employee_dataset.csv"


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
        is_exist = _collection[COLLECTION].count()
        print(f"{COLLECTION} is exist: {is_exist}")
        return is_exist != 0
    except Exception as e:
        raise e


if __name__ == '__main__':
    pass
