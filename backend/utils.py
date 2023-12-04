import pandas
import pymongo
import json
'''
db.createUser({
    user: "admin",
    pwd: "123456",
    roles: ["root"]
})
'''
db_host = "192.168.1.6"
db_port = 27017
username = "admin"
password = "LZHlzh.rootOOT"
client = pymongo.MongoClient(db_host, db_port, username=username, password=password)
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

def export_dataset():
    db = client[DATABASE_NAME]
    collection_names = db.list_collection_names()

    # 遍历集合并导出数据
    for collection_name in collection_names:
        collection = db[collection_name]
        documents = collection.find({})

        # 将文档转换为JSON并写入文件
        with open(f'../res/{collection_name}.json', 'w') as file:
            json.dump(list(documents), file, default=str)  # 使用 default=str 来处理无法直接序列化的数据类型


if __name__ == '__main__':
    export_dataset()
