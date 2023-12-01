import pandas
import pymongo
'''
db.createUser({
    user: "admin",
    pwd: "123456",
    roles: ["root"]
})
'''
db_host = "192.168.1.6"
db_port = 27017
password = "LZHlzh.rootOOT"
client = pymongo.MongoClient(db_host, db_port, username="admin", password=password)
DATABASE_NAME = "employee"
DATA_COLLECTION = "data"
EMPLOYEE_COLLECTION = "employee"
DATASET_PATH = "dataset/employee_dataset.csv"


def read_dataset():
    data = pandas.read_csv(DATASET_PATH, encoding='gbk')
    data = data.fillna("")
    data = data.to_dict(orient="records")
    database = client[DATABASE_NAME]
    list_data = []
    for item in data:
        list_data.append(item)
    database[DATA_COLLECTION].insert_many(list_data)
    return data


def get_db():
    try:
        _DATA_COLLECTION = client[DATABASE_NAME]
        is_exist = _DATA_COLLECTION[DATA_COLLECTION].count()
        print(f"{DATA_COLLECTION} is exist: {is_exist}")
        return is_exist != 0
    except Exception as e:
        raise e


if __name__ == '__main__':
    pass
